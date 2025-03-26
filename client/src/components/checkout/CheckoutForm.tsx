import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { UserAddress } from "@shared/schema";

const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(5, "Valid zip code is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(10, "Valid phone number is required")
});

const paymentSchema = z.object({
  paymentMethod: z.enum(["creditCard", "paypal"]),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  securityCode: z.string().optional(),
  nameOnCard: z.string().optional()
});

const newAddressSchema = z.object({
  addressName: z.string().min(1, "Address name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(5, "Valid zip code is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  isDefault: z.boolean().optional()
});

const checkoutFormSchema = z.object({
  selectedAddressId: z.string().optional(),
  newAddress: newAddressSchema.optional(),
  shipping: shippingSchema,
  payment: paymentSchema
}).refine(data => {
  // If credit card is selected, validate card details
  if (data.payment.paymentMethod === "creditCard") {
    return !!data.payment.cardNumber && 
           !!data.payment.expiryDate && 
           !!data.payment.securityCode && 
           !!data.payment.nameOnCard;
  }
  return true;
}, {
  message: "Please complete all payment details",
  path: ["payment"]
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  onFormSubmit: (data: CheckoutFormValues) => void;
  formRef?: React.RefObject<HTMLFormElement>;
}

const CheckoutForm = ({ onFormSubmit, formRef }: CheckoutFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"creditCard" | "paypal">("creditCard");
  const [addressTab, setAddressTab] = useState<"saved" | "new">("saved");
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const res = await apiRequest("GET", "/api/users/addresses");
        const addresses = await res.json();
        setSavedAddresses(addresses);
        
        // Set default address if available
        const defaultAddress = addresses.find((address: UserAddress) => address.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id.toString());
          populateFormWithAddress(defaultAddress);
        } else if (addresses.length > 0) {
          setSelectedAddressId(addresses[0].id.toString());
          populateFormWithAddress(addresses[0]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch saved addresses",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [toast]);

  const populateFormWithAddress = (address: UserAddress) => {
    form.setValue("shipping.firstName", address.firstName);
    form.setValue("shipping.lastName", address.lastName);
    form.setValue("shipping.address", address.address);
    form.setValue("shipping.city", address.city);
    form.setValue("shipping.zipCode", address.zipCode);
    form.setValue("shipping.state", address.state);
    form.setValue("shipping.country", address.country);
    form.setValue("shipping.phone", address.phone);
  };

  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find(addr => addr.id.toString() === addressId);
    if (address) {
      populateFormWithAddress(address);
    }
  };

  const handleSaveNewAddress = async () => {
    try {
      const isDefault = form.getValues("newAddress.isDefault") || false;
      const newAddressData = {
        addressName: form.getValues("newAddress.addressName"),
        firstName: form.getValues("newAddress.firstName"),
        lastName: form.getValues("newAddress.lastName"),
        address: form.getValues("newAddress.address"),
        city: form.getValues("newAddress.city"),
        zipCode: form.getValues("newAddress.zipCode"),
        state: form.getValues("newAddress.state"),
        country: form.getValues("newAddress.country"),
        phone: form.getValues("newAddress.phone"),
        isDefault: isDefault
      };

      const res = await apiRequest("POST", "/api/users/addresses", newAddressData);
      
      if (!res.ok) {
        throw new Error("Failed to save address");
      }
      
      const newAddress = await res.json();
      setSavedAddresses(prevAddresses => [...prevAddresses, newAddress]);
      
      // Switch to saved addresses tab and select the new address
      setAddressTab("saved");
      setSelectedAddressId(newAddress.id.toString());
      populateFormWithAddress(newAddress);
      
      toast({
        title: "Success",
        description: "Address saved successfully",
      });
      
      // Clear the new address form
      form.reset({
        ...form.getValues(),
        newAddress: {
          addressName: "",
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          zipCode: "",
          state: "",
          country: "US",
          phone: "",
          isDefault: false
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const res = await apiRequest("DELETE", `/api/users/addresses/${addressId}`);
      
      if (!res.ok) {
        throw new Error("Failed to delete address");
      }
      
      setSavedAddresses(prevAddresses => 
        prevAddresses.filter(addr => addr.id.toString() !== addressId)
      );
      
      // If we deleted the selected address, select another one
      if (selectedAddressId === addressId) {
        const remainingAddresses = savedAddresses.filter(addr => addr.id.toString() !== addressId);
        
        if (remainingAddresses.length > 0) {
          setSelectedAddressId(remainingAddresses[0].id.toString());
          populateFormWithAddress(remainingAddresses[0]);
        } else {
          setSelectedAddressId("");
          setAddressTab("new");
        }
      }
      
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    }
  };
  
  const handleSetDefaultAddress = async (addressId: string, isDefault: boolean, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card from being selected
    
    try {
      // Don't do anything if it's already set to the desired state
      const address = savedAddresses.find(addr => addr.id.toString() === addressId);
      if (address && address.isDefault === isDefault) return;
      
      const res = await apiRequest("PATCH", `/api/users/addresses/${addressId}`, {
        isDefault: isDefault
      });
      
      if (!res.ok) {
        throw new Error("Failed to update address");
      }
      
      // Update the addresses in the state
      setSavedAddresses(prevAddresses => 
        prevAddresses.map(addr => {
          // First set all addresses to not default
          let updatedAddr = { ...addr, isDefault: false };
          // Then set the selected address to default if needed
          if (addr.id.toString() === addressId && isDefault) {
            updatedAddr.isDefault = true;
          }
          return updatedAddr;
        })
      );
      
      toast({
        title: "Success",
        description: isDefault ? "Address set as default" : "Address is no longer default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive"
      });
    }
  };

  const defaultValues: CheckoutFormValues = {
    selectedAddressId: "",
    shipping: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zipCode: "",
      state: "",
      country: "US",
      phone: ""
    },
    newAddress: {
      addressName: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zipCode: "",
      state: "",
      country: "US",
      phone: "",
      isDefault: false
    },
    payment: {
      paymentMethod: "creditCard",
      cardNumber: "",
      expiryDate: "",
      securityCode: "",
      nameOnCard: ""
    }
  };

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues
  });

  const onSubmit = (data: CheckoutFormValues) => {
    // Add selected address ID to the form data
    if (addressTab === "saved" && selectedAddressId) {
      data.selectedAddressId = selectedAddressId;
    }
    onFormSubmit(data);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as "creditCard" | "paypal");
    form.setValue("payment.paymentMethod", value as "creditCard" | "paypal");
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#1D3557] mb-4">Shipping Information</h2>
          
          <h3 className="text-lg font-medium text-[#1D3557] mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-[#457B9D]">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Select Delivery Address
          </h3>
          <Tabs defaultValue="saved" value={addressTab} onValueChange={(value) => setAddressTab(value as "saved" | "new")}>
            <TabsList className="mb-4 w-full flex-wrap justify-center">
              <TabsTrigger value="saved" disabled={savedAddresses.length === 0} className="flex-1 text-sm px-2 py-1.5">
                Use Saved Address
              </TabsTrigger>
              <TabsTrigger value="new" className="flex-1 text-sm px-2 py-1.5">
                Add New Address
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="saved" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-[#457B9D] rounded-full border-t-transparent"></div>
                </div>
              ) : savedAddresses.length > 0 ? (
                <div>
                  <p className="font-medium text-[#457B9D] mb-3">Click to select delivery address:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedAddresses.map((address) => (
                      <div 
                        key={address.id} 
                        className={`border p-4 rounded-lg shadow-sm hover:shadow cursor-pointer relative transition-all ${
                          selectedAddressId === address.id.toString() 
                            ? 'border-2 border-[#457B9D] bg-blue-50' 
                            : 'border-gray-200 hover:border-[#A8DADC]'
                        }`}
                        onClick={() => handleAddressChange(address.id.toString())}
                      >
                        <div className="mb-2 flex justify-between items-start">
                          <h3 className="font-semibold text-[#1D3557] truncate pr-10" title={address.addressName}>
                            {address.addressName}
                          </h3>
                          <Button
                            type="button"
                            variant="ghost"
                            className="p-1 h-auto w-auto min-w-0 text-gray-400 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(address.id.toString());
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        
                        <div className="text-gray-600 space-y-1">
                          <div className="font-medium">{address.firstName} {address.lastName}</div>
                          <div>{address.address}</div>
                          <div>{address.city}, {address.state} {address.zipCode}</div>
                          <div>{address.country}</div>
                          <div className="mt-2">{address.phone}</div>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <div>
                            {address.isDefault && (
                              <span className="text-xs text-[#457B9D] border border-[#457B9D] px-2 py-0.5 rounded">
                                Default address
                              </span>
                            )}
                          </div>
                          <div>
                            {selectedAddressId === address.id.toString() && (
                              <span className="text-xs text-white bg-[#457B9D] px-2 py-1 rounded-full">
                                Selected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No saved addresses. Please add a new address.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="new">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="newAddress.addressName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-[#457B9D]">Address Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Home, Work, etc." 
                          className="border-gray-200 focus:border-[#A8DADC] focus:ring-[#A8DADC]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newAddress.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#457B9D]">First Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-gray-200 focus:border-[#A8DADC] focus:ring-[#A8DADC]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newAddress.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#457B9D]">Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-gray-200 focus:border-[#A8DADC] focus:ring-[#A8DADC]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newAddress.address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-[#457B9D]">Address</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-gray-200 focus:border-[#A8DADC] focus:ring-[#A8DADC]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#457B9D]">City</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-gray-200 focus:border-[#A8DADC] focus:ring-[#A8DADC]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newAddress.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#457B9D]">Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-gray-200 focus:border-[#A8DADC] focus:ring-[#A8DADC]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newAddress.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#457B9D]">State</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-200 focus:ring-[#A8DADC]">
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newAddress.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#457B9D]">Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-200 focus:ring-[#A8DADC]">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newAddress.phone"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-[#457B9D]">Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-gray-200 focus:border-[#A8DADC] focus:ring-[#A8DADC]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newAddress.isDefault"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 flex flex-row items-start space-x-3 space-y-0 mb-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value === true}
                          onCheckedChange={(checked) => {
                            if (checked !== "indeterminate") {
                              field.onChange(checked);
                            }
                          }}
                          className="data-[state=checked]:bg-[#457B9D] data-[state=checked]:border-[#457B9D]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium leading-none text-gray-500 cursor-pointer">
                          Set as default address
                        </FormLabel>
                        <p className="text-xs text-gray-400">
                          This address will be automatically selected on checkout
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="md:col-span-2">
                  <Button
                    type="button"
                    onClick={handleSaveNewAddress}
                    className="bg-[#457B9D] hover:bg-[#1D3557] text-white flex items-center space-x-2"
                  >
                    <PlusCircle size={16} />
                    <span>Save Address</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Hidden shipping fields that will be submitted */}
          <div className="hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shipping.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shipping.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shipping.address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shipping.city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shipping.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shipping.state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shipping.country"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shipping.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#1D3557] mb-4">Payment Information</h2>
          
          <FormField
            control={form.control}
            name="payment.paymentMethod"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormControl>
                  <RadioGroup 
                    onValueChange={handlePaymentMethodChange} 
                    defaultValue={field.value} 
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="creditCard" id="creditCard" />
                      <Label htmlFor="creditCard" className="text-[#457B9D]">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="text-[#457B9D]">PayPal</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {paymentMethod === "creditCard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="payment.cardNumber"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[#457B9D]">Card Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="•••• •••• •••• ••••" className="border-gray-200 focus:border-[#A8DADC] focus:ring-[#A8DADC]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="payment.expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#457B9D]">Expiry Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="MM/YY" className="border-gray-200 focus:border-[#A8DADC] focus:ring-[#A8DADC]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="payment.securityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#457B9D]">Security Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="•••" className="border-gray-200 focus:border-[#A8DADC] focus:ring-[#A8DADC]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="payment.nameOnCard"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[#457B9D]">Name on Card</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-gray-200 focus:border-[#A8DADC] focus:ring-[#A8DADC]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        
        {/* Hidden submit button - OrderSummary will trigger form submission */}
        <button type="submit" className="hidden" />
      </form>
    </Form>
  );
};

export default CheckoutForm;