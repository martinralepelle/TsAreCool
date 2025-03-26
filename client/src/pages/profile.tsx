import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToastNotification } from "@/components/ui/toast-notification";
import { useState } from "react";
import { Check, CreditCard, Edit, MapPin, Plus, Save, Trash, X } from "lucide-react";
import { UserAddress, PaymentMethod } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

const addressSchema = z.object({
  addressName: z.string().min(1, "Address name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Valid zip code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  isDefault: z.boolean().default(false),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const paymentMethodSchema = z.object({
  cardName: z.string().min(1, "Card name is required"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z.string().min(4, "Last 4 digits of card number are required"),
  cardType: z.string().min(1, "Card type is required"),
  expiryMonth: z.string().min(1, "Expiry month is required"),
  expiryYear: z.string().min(4, "Expiry year is required"),
  isDefault: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type AddressFormValues = z.infer<typeof addressSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useToastNotification();
  const [editingProfileInfo, setEditingProfileInfo] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);
  const [editingPaymentMethodId, setEditingPaymentMethodId] = useState<number | null>(null);

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/users/profile"],
    queryFn: async () => {
      // In a real app, this would be an actual API call
      return {
        id: 1,
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "555-123-4567",
        createdAt: new Date().toISOString()
      };
    }
  });

  // Fetch user addresses
  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ["/api/users/addresses"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/users/addresses");
      return await response.json();
    }
  });
  
  // Fetch user payment methods
  const { data: paymentMethods = [], isLoading: paymentMethodsLoading } = useQuery({
    queryKey: ["/api/users/payment-methods"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/users/payment-methods");
      return await response.json();
    }
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    },
  });

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressName: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      phone: "",
      isDefault: false,
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const paymentMethodForm = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      cardName: "",
      cardholderName: "",
      cardNumber: "",
      cardType: "visa",
      expiryMonth: "",
      expiryYear: "",
      isDefault: false,
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await apiRequest("PATCH", "/api/users/profile", data);
      queryClient.invalidateQueries({ queryKey: ["/api/users/profile"] });
      showToast("Profile information updated successfully!");
      setEditingProfileInfo(false);
    } catch (error) {
      showToast("Failed to update profile information. Please try again.");
    }
  };

  const onAddressSubmit = async (data: AddressFormValues) => {
    try {
      if (editingAddressId) {
        // Update existing address
        await apiRequest("PUT", `/api/users/addresses/${editingAddressId}`, data);
        showToast("Address updated successfully!");
      } else {
        // Create new address
        await apiRequest("POST", "/api/users/addresses", data);
        showToast("Address added successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ["/api/users/addresses"] });
      setAddressDialogOpen(false);
      setEditingAddressId(null);
      addressForm.reset();
    } catch (error) {
      showToast("Failed to save address. Please try again.");
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await apiRequest("PATCH", "/api/users/password", data);
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast("Password updated successfully!");
    } catch (error) {
      showToast("Failed to update password. Please try again.");
    }
  };

  const handleEditAddress = (address: UserAddress) => {
    setEditingAddressId(address.id);
    addressForm.reset({
      addressName: address.addressName,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault || false,
    });
    setAddressDialogOpen(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddressId(null);
    addressForm.reset({
      addressName: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      phone: "",
      isDefault: false,
    });
    setAddressDialogOpen(true);
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      await apiRequest("DELETE", `/api/users/addresses/${id}`);
      showToast("Address deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["/api/users/addresses"] });
    } catch (error) {
      showToast("Failed to delete address. Please try again.");
    }
  };

  const setAddressAsDefault = async (id: number) => {
    try {
      // First, find the current address and update it
      const address = addresses.find((a: UserAddress) => a.id === id);
      if (!address) return;
      
      // Create an optimistic update for better UI responsiveness
      // Clear default status from all addresses and set for the selected one
      const updatedAddresses = addresses.map((a: UserAddress) => ({
        ...a,
        isDefault: a.id === id
      }));
      
      // Apply optimistic updates to the UI immediately
      queryClient.setQueryData(["/api/users/addresses"], updatedAddresses);
      
      // Make the actual API request
      await apiRequest("PUT", `/api/users/addresses/${id}`, {
        ...address,
        isDefault: true
      });
      
      showToast("Default address updated successfully!");
      
      // Refetch to ensure data is in sync with the server
      queryClient.invalidateQueries({ queryKey: ["/api/users/addresses"] });
    } catch (error) {
      showToast("Failed to update default address. Please try again.");
      // Refetch to restore correct state in case of error
      queryClient.invalidateQueries({ queryKey: ["/api/users/addresses"] });
    }
  };
  
  const onPaymentMethodSubmit = async (data: PaymentMethodFormValues) => {
    try {
      if (editingPaymentMethodId) {
        // Update existing payment method
        await apiRequest("PUT", `/api/users/payment-methods/${editingPaymentMethodId}`, data);
        showToast("Payment method updated successfully!");
      } else {
        // Create new payment method
        await apiRequest("POST", "/api/users/payment-methods", data);
        showToast("Payment method added successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ["/api/users/payment-methods"] });
      setPaymentMethodDialogOpen(false);
      setEditingPaymentMethodId(null);
      paymentMethodForm.reset();
    } catch (error) {
      showToast("Failed to save payment method. Please try again.");
    }
  };
  
  const handleEditPaymentMethod = (paymentMethod: PaymentMethod) => {
    setEditingPaymentMethodId(paymentMethod.id);
    paymentMethodForm.reset({
      cardName: paymentMethod.cardName,
      cardholderName: paymentMethod.cardholderName,
      cardNumber: paymentMethod.cardNumber,
      cardType: paymentMethod.cardType,
      expiryMonth: paymentMethod.expiryMonth,
      expiryYear: paymentMethod.expiryYear,
      isDefault: paymentMethod.isDefault || false,
    });
    setPaymentMethodDialogOpen(true);
  };
  
  const handleAddNewPaymentMethod = () => {
    setEditingPaymentMethodId(null);
    paymentMethodForm.reset({
      cardName: "",
      cardholderName: "",
      cardNumber: "",
      cardType: "visa",
      expiryMonth: "",
      expiryYear: "",
      isDefault: false,
    });
    setPaymentMethodDialogOpen(true);
  };
  
  const handleDeletePaymentMethod = async (id: number) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;
    
    try {
      await apiRequest("DELETE", `/api/users/payment-methods/${id}`);
      showToast("Payment method deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["/api/users/payment-methods"] });
    } catch (error) {
      showToast("Failed to delete payment method. Please try again.");
    }
  };
  
  const setPaymentMethodAsDefault = async (id: number) => {
    try {
      // First, find the current payment method to update
      const paymentMethod = paymentMethods.find((pm: PaymentMethod) => pm.id === id);
      if (!paymentMethod) return;
      
      // Create an optimistic update for better UI responsiveness
      // Clear default status from all payment methods and set for the selected one
      const updatedPaymentMethods = paymentMethods.map((pm: PaymentMethod) => ({
        ...pm,
        isDefault: pm.id === id
      }));
      
      // Apply optimistic updates to the UI immediately to show change before API completes
      queryClient.setQueryData(["/api/users/payment-methods"], updatedPaymentMethods);
      
      // Make the actual API request
      await apiRequest("PUT", `/api/users/payment-methods/${id}`, {
        ...paymentMethod,
        isDefault: true
      });
      
      showToast("Default payment method updated successfully!");
      
      // Refetch to ensure data is in sync with the server
      queryClient.invalidateQueries({ queryKey: ["/api/users/payment-methods"] });
    } catch (error) {
      showToast("Failed to update default payment method. Please try again.");
      // Refetch to restore correct state in case of error
      queryClient.invalidateQueries({ queryKey: ["/api/users/payment-methods"] });
    }
  };

  if (profileLoading || addressesLoading || paymentMethodsLoading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-[#1D3557] mb-8">Your Profile</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account information and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="space-y-6">
            <div className="overflow-x-auto pb-2">
              <TabsList className="flex min-w-max space-x-2 bg-transparent p-0">
                <TabsTrigger 
                  value="info"
                  className="whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors data-[state=active]:bg-[#A8DADC] data-[state=active]:text-[#1D3557] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-[#457B9D] data-[state=inactive]:hover:bg-[#A8DADC]/50"
                >
                  Personal Info
                </TabsTrigger>
                <TabsTrigger 
                  value="addresses"
                  className="whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors data-[state=active]:bg-[#A8DADC] data-[state=active]:text-[#1D3557] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-[#457B9D] data-[state=inactive]:hover:bg-[#A8DADC]/50"
                >
                  Addresses
                </TabsTrigger>
                <TabsTrigger 
                  value="payment-methods"
                  className="whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors data-[state=active]:bg-[#A8DADC] data-[state=active]:text-[#1D3557] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-[#457B9D] data-[state=inactive]:hover:bg-[#A8DADC]/50"
                >
                  Payment Methods
                </TabsTrigger>
                <TabsTrigger 
                  value="password"
                  className="whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors data-[state=active]:bg-[#A8DADC] data-[state=active]:text-[#1D3557] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-[#457B9D] data-[state=inactive]:hover:bg-[#A8DADC]/50"
                >
                  Password
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Personal Info Tab */}
            <TabsContent value="info">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                <h3 className="text-lg font-medium text-[#1D3557]">Personal Information</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (editingProfileInfo) {
                      setEditingProfileInfo(false);
                    } else {
                      setEditingProfileInfo(true);
                      // Reset form with current values
                      profileForm.reset({
                        name: profile?.name || "",
                        email: profile?.email || "",
                        phone: profile?.phone || "",
                      });
                    }
                  }}
                  className="flex items-center gap-1 whitespace-nowrap self-start sm:self-auto"
                >
                  {editingProfileInfo ? (
                    <>
                      <X size={16} /> Cancel
                    </>
                  ) : (
                    <>
                      <Edit size={16} /> Edit
                    </>
                  )}
                </Button>
              </div>

              {editingProfileInfo ? (
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="bg-[#1D3557] hover:bg-[#457B9D]">
                      <Save size={16} className="mr-2" /> Save Changes
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-[#1D3557]">{profile?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-[#1D3557]">{profile?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-[#1D3557]">{profile?.phone || "N/A"}</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                <h3 className="text-lg font-medium text-[#1D3557]">Your Addresses</h3>
                <div className="flex justify-center w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddNewAddress}
                    className="flex items-center gap-1 whitespace-nowrap"
                  >
                    <Plus size={16} /> Add New Address
                  </Button>
                </div>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-md">
                  <MapPin className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-500">You don't have any saved addresses yet.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={handleAddNewAddress}
                  >
                    Add your first address
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address: UserAddress) => (
                    <Card 
                      key={address.id} 
                      className={`${address.isDefault ? 'border-[#457B9D] border-2 bg-[#F1FAEE]/30' : ''} overflow-hidden transition-all duration-300`}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span className="flex items-center flex-wrap">
                            <span className="mr-2">{address.addressName}</span>
                            {address.isDefault && (
                              <span className="text-xs px-2 py-0.5 bg-[#A8DADC] text-[#1D3557] rounded-full font-medium inline-block">
                                Default
                              </span>
                            )}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">{address.firstName} {address.lastName}</p>
                          <p>{address.address}</p>
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                          <p>{address.country}</p>
                          <p>{address.phone}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-wrap justify-between gap-2 pt-0">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditAddress(address)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`default-${address.id}`} 
                            checked={address.isDefault || false}
                            disabled={address.isDefault || false}
                            onCheckedChange={(checked) => {
                              if (checked && !address.isDefault) {
                                setAddressAsDefault(address.id);
                              }
                            }}
                            className={address.isDefault ? "opacity-50" : ""}
                          />
                          <Label htmlFor={`default-${address.id}`} className="text-sm">
                            Default address
                          </Label>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {/* Address Dialog */}
              <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAddressId ? "Edit Address" : "Add New Address"}
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the address details below. Fields marked with * are required.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4 mt-2">
                      <FormField
                        control={addressForm.control}
                        name="addressName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Home, Work, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={addressForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addressForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={addressForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={addressForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addressForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={addressForm.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip/Postal Code *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addressForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={addressForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addressForm.control}
                        name="isDefault"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-[#1D3557] focus:ring-[#457B9D] border-gray-300 rounded"
                                checked={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="cursor-pointer">
                                Set as default address
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setAddressDialogOpen(false);
                            setEditingAddressId(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-[#1D3557] hover:bg-[#457B9D]">
                          {editingAddressId ? "Update Address" : "Add Address"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            {/* Payment Methods Tab */}
            <TabsContent value="payment-methods">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                <h3 className="text-lg font-medium text-[#1D3557]">Your Payment Methods</h3>
                <div className="flex justify-center w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddNewPaymentMethod}
                    className="flex items-center gap-1 whitespace-nowrap"
                  >
                    <Plus size={16} /> Add New Payment Method
                  </Button>
                </div>
              </div>

              {paymentMethods.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-md">
                  <CreditCard className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-500">You don't have any saved payment methods yet.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={handleAddNewPaymentMethod}
                  >
                    Add your first payment method
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((paymentMethod: PaymentMethod) => (
                    <Card 
                      key={paymentMethod.id} 
                      className={`${paymentMethod.isDefault ? 'border-[#457B9D] border-2 bg-[#F1FAEE]/30' : ''} overflow-hidden transition-all duration-300`}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span className="flex items-center flex-wrap">
                            <span className="mr-2">{paymentMethod.cardName}</span>
                            {paymentMethod.isDefault && (
                              <span className="text-xs px-2 py-0.5 bg-[#A8DADC] text-[#1D3557] rounded-full font-medium inline-block">
                                Default
                              </span>
                            )}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">{paymentMethod.cardholderName}</p>
                          <p>•••• •••• •••• {paymentMethod.cardNumber.slice(-4)}</p>
                          <p>Expires: {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}</p>
                          <p className="capitalize">{paymentMethod.cardType}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-wrap justify-between gap-2 pt-0">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditPaymentMethod(paymentMethod)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleDeletePaymentMethod(paymentMethod.id)}
                          >
                            <Trash className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`default-payment-${paymentMethod.id}`} 
                            checked={paymentMethod.isDefault || false}
                            disabled={paymentMethod.isDefault || false}
                            onCheckedChange={(checked) => {
                              if (checked && !paymentMethod.isDefault) {
                                setPaymentMethodAsDefault(paymentMethod.id);
                              }
                            }}
                            className={paymentMethod.isDefault ? "opacity-50" : ""}
                          />
                          <Label htmlFor={`default-payment-${paymentMethod.id}`} className="text-sm">
                            Default payment method
                          </Label>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {/* Payment Method Dialog */}
              <Dialog open={paymentMethodDialogOpen} onOpenChange={setPaymentMethodDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPaymentMethodId ? "Edit Payment Method" : "Add New Payment Method"}
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the payment method details below. Fields marked with * are required.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...paymentMethodForm}>
                    <form onSubmit={paymentMethodForm.handleSubmit(onPaymentMethodSubmit)} className="space-y-4 mt-2">
                      <FormField
                        control={paymentMethodForm.control}
                        name="cardName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Personal, Work, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentMethodForm.control}
                        name="cardholderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cardholder Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Name as it appears on card" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentMethodForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="XXXX XXXX XXXX XXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={paymentMethodForm.control}
                          name="expiryMonth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Month *</FormLabel>
                              <FormControl>
                                <Input placeholder="MM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={paymentMethodForm.control}
                          name="expiryYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Year *</FormLabel>
                              <FormControl>
                                <Input placeholder="YYYY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={paymentMethodForm.control}
                          name="cardType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Type *</FormLabel>
                              <Select 
                                defaultValue={field.value} 
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select card type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="visa">Visa</SelectItem>
                                  <SelectItem value="mastercard">Mastercard</SelectItem>
                                  <SelectItem value="amex">American Express</SelectItem>
                                  <SelectItem value="discover">Discover</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={paymentMethodForm.control}
                        name="isDefault"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-[#1D3557] focus:ring-[#457B9D] border-gray-300 rounded"
                                checked={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Set as default payment method</FormLabel>
                              <FormDescription>
                                This payment method will be used by default for future purchases.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setPaymentMethodDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-[#1D3557] hover:bg-[#457B9D]">
                          {editingPaymentMethodId ? "Update" : "Add"} Payment Method
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            {/* Password Tab */}
            <TabsContent value="password">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="bg-[#1D3557] hover:bg-[#457B9D]">
                    Update Password
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;