import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Mail, MapPin, Phone } from "lucide-react";

const HelpPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold text-[#1D3557] mb-6">Help Center</h1>
      
      <Tabs defaultValue="faq" className="mb-10">
        <div className="overflow-x-auto pb-2 mb-4">
          <TabsList className="flex min-w-max space-x-2 bg-transparent p-0">
            <TabsTrigger 
              value="faq"
              className="whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors data-[state=active]:bg-[#A8DADC] data-[state=active]:text-[#1D3557] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-[#457B9D] data-[state=inactive]:hover:bg-[#A8DADC]/50"
            >
              Frequently Asked Questions
            </TabsTrigger>
            <TabsTrigger 
              value="shipping"
              className="whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors data-[state=active]:bg-[#A8DADC] data-[state=active]:text-[#1D3557] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-[#457B9D] data-[state=inactive]:hover:bg-[#A8DADC]/50"
            >
              Shipping & Returns
            </TabsTrigger>
            <TabsTrigger 
              value="contact"
              className="whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors data-[state=active]:bg-[#A8DADC] data-[state=active]:text-[#1D3557] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-[#457B9D] data-[state=inactive]:hover:bg-[#A8DADC]/50"
            >
              Contact Us
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#457B9D]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find answers to common questions about our products and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-[#1D3557] font-medium">
                    How do I choose the right size?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <p>We recommend checking our size guide available on every product page. Our t-shirts generally run true to size. If you're between sizes, we recommend going up a size for a more relaxed fit.</p>
                    <p className="mt-2">You can also find detailed measurements for each size in our size charts.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-[#1D3557] font-medium">
                    What payment methods do you accept?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All payments are processed securely through our payment provider.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-[#1D3557] font-medium">
                    How long will shipping take?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <p>Standard shipping typically takes 3-7 business days within the continental United States.</p>
                    <p className="mt-2">Express shipping options are available at checkout for 1-3 business day delivery.</p>
                    <p className="mt-2">International shipping times vary by location, generally taking 7-14 business days.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-[#1D3557] font-medium">
                    What is your return policy?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    We offer a 30-day return policy for unworn items in original condition with tags attached. Please visit our Returns & Exchanges section for more details on how to initiate a return.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-[#1D3557] font-medium">
                    How do I care for my t-shirts?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <p>For best results:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Machine wash cold with similar colors</li>
                      <li>Use mild detergent</li>
                      <li>Tumble dry low or hang to dry</li>
                      <li>Avoid bleach and fabric softeners</li>
                      <li>Iron inside out on low heat if needed</li>
                    </ul>
                    <p className="mt-2">Following these care instructions will help maintain the quality and extend the life of your t-shirts.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-[#1D3557] font-medium">
                    Do you offer gift wrapping?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes! We offer gift wrapping services for an additional $5 per item. You can select this option during checkout. We use eco-friendly packaging materials and include a personalized gift message if requested.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[#457B9D]" />
                Shipping & Returns
              </CardTitle>
              <CardDescription>
                Information about our shipping policies and return process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-[#1D3557] mb-3">Shipping Policy</h3>
                  <div className="text-gray-600 space-y-2">
                    <p>All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.</p>
                    
                    <h4 className="font-medium text-[#1D3557] mt-4 mb-2">Shipping Options</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><span className="font-medium">Standard Shipping:</span> 3-7 business days (Free on orders over $50)</li>
                      <li><span className="font-medium">Express Shipping:</span> 2-3 business days ($10)</li>
                      <li><span className="font-medium">Priority Shipping:</span> 1-2 business days ($15)</li>
                    </ul>
                    
                    <h4 className="font-medium text-[#1D3557] mt-4 mb-2">International Shipping</h4>
                    <p>We ship to most countries worldwide. International shipping times vary by location, generally taking 7-14 business days. International customers may be subject to import duties and taxes.</p>
                    
                    <h4 className="font-medium text-[#1D3557] mt-4 mb-2">Tracking Information</h4>
                    <p>You will receive tracking information via email once your order has shipped. You can also view tracking information in your account under "Order History".</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-[#1D3557] mb-3">Return Policy</h3>
                  <div className="text-gray-600 space-y-2">
                    <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, we accept returns within 30 days of delivery.</p>
                    
                    <h4 className="font-medium text-[#1D3557] mt-4 mb-2">Return Requirements</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Items must be unworn and in original condition</li>
                      <li>Original tags must be attached</li>
                      <li>Items must be in original packaging</li>
                      <li>Sale items are final sale and cannot be returned</li>
                    </ul>
                    
                    <h4 className="font-medium text-[#1D3557] mt-4 mb-2">How to Return</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Log into your account and visit the "Order History" section</li>
                      <li>Select the order and items you wish to return</li>
                      <li>Print the prepaid return shipping label</li>
                      <li>Pack the items securely in the original packaging</li>
                      <li>Attach the return label and drop off at any postal location</li>
                    </ol>
                    
                    <h4 className="font-medium text-[#1D3557] mt-4 mb-2">Refund Process</h4>
                    <p>Once we receive and inspect your return, we will process your refund within 3-5 business days. The refund will be issued to the original payment method used for the purchase. Please allow 5-10 business days for the refund to appear on your statement.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-[#457B9D]" />
                Contact Us
              </CardTitle>
              <CardDescription>
                We're here to help! Reach out to us with any questions or concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-[#1D3557] mb-4">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-[#457B9D] mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-[#1D3557]">Email Us</p>
                        <p className="text-gray-600">support@tsarecool.com</p>
                        <p className="text-gray-500 text-sm mt-1">We typically respond within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-[#457B9D] mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-[#1D3557]">Call Us</p>
                        <p className="text-gray-600">(555) 123-4567</p>
                        <p className="text-gray-500 text-sm mt-1">Monday-Friday, 9AM-5PM EST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-[#457B9D] mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-[#1D3557]">Our Address</p>
                        <p className="text-gray-600">123 T-Shirt Lane</p>
                        <p className="text-gray-600">Fashion District</p>
                        <p className="text-gray-600">New York, NY 10001</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-[#1D3557] mb-4">Customer Service Hours</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="text-gray-600">9:00 AM - 5:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="text-gray-600">10:00 AM - 2:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="text-gray-600">Closed</span>
                    </div>
                    
                    <div className="text-gray-500 mt-4 text-sm">
                      <p>Response times may be longer during high-volume periods and holidays.</p>
                      <p className="mt-2">For urgent matters outside of business hours, please email us and we'll get back to you as soon as possible.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpPage;