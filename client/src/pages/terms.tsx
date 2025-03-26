import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Lock, Shield } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold text-[#1D3557] mb-6">Terms & Policies</h1>
      
      <Tabs defaultValue="terms" className="mb-10">
        <div className="overflow-x-auto pb-2 mb-4">
          <TabsList className="flex min-w-max space-x-2 bg-transparent p-0">
            <TabsTrigger 
              value="terms"
              className="whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors data-[state=active]:bg-[#A8DADC] data-[state=active]:text-[#1D3557] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-[#457B9D] data-[state=inactive]:hover:bg-[#A8DADC]/50"
            >
              Terms of Service
            </TabsTrigger>
            <TabsTrigger 
              value="privacy"
              className="whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors data-[state=active]:bg-[#A8DADC] data-[state=active]:text-[#1D3557] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-[#457B9D] data-[state=inactive]:hover:bg-[#A8DADC]/50"
            >
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors data-[state=active]:bg-[#A8DADC] data-[state=active]:text-[#1D3557] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-[#457B9D] data-[state=inactive]:hover:bg-[#A8DADC]/50"
            >
              Security
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-[#457B9D]" />
                Terms of Service
              </CardTitle>
              <CardDescription>
                Last updated: March 25, 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none text-gray-600">
              <h2 className="text-xl font-semibold text-[#1D3557] mt-2 mb-4">1. Introduction</h2>
              <p>
                Welcome to Ts Are Cool. These Terms of Service ("Terms") govern your use of our website, 
                located at www.tsarecool.com (the "Site"), and form a binding contractual agreement between you, 
                the user of the Site ("User") and us, Ts Are Cool ("Company", "we", "us").
              </p>
              <p>
                By accessing or using the Site, you acknowledge that you have read, understood, and agree to be bound 
                by these Terms. If you do not agree with these Terms, please do not access or use the Site.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">2. Eligibility</h2>
              <p>
                The Site is intended solely for users who are at least 18 years of age. By using the Site, you 
                represent and warrant that you are at least 18 years old and that you have the legal capacity 
                to enter into these Terms.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">3. Account Registration</h2>
              <p>
                To access certain features of the Site, you may be required to register for an account. 
                When you register, you agree to provide accurate, current, and complete information and to 
                update such information to keep it accurate, current, and complete. You are solely responsible 
                for safeguarding your account credentials and for all activity that occurs under your account.
              </p>
              <p>
                We reserve the right to suspend or terminate your account if any information provided during 
                registration or thereafter proves to be inaccurate, false, or incomplete.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">4. Products and Orders</h2>
              <p>
                All product descriptions, prices, and availability information are subject to change at any time 
                without notice. We reserve the right to limit quantities of products purchased and to refuse service 
                to anyone.
              </p>
              <p>
                By placing an order, you are making an offer to purchase products. We reserve the right to accept or 
                decline your offer for any reason, including product unavailability, inaccuracies in product information, 
                or errors in pricing.
              </p>
              <p>
                Colors and appearance of products may vary from what is displayed on your screen due to monitor 
                settings and differences in display technology.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">5. Payment and Pricing</h2>
              <p>
                All prices are shown in US dollars and do not include taxes or shipping costs, which will be added 
                at checkout. We accept various payment methods as indicated during the checkout process.
              </p>
              <p>
                In the event of a pricing error, we reserve the right to cancel any orders placed for products listed 
                at an incorrect price. If we are unable to verify your payment method or billing information, we may 
                cancel your order.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">6. Shipping and Delivery</h2>
              <p>
                Shipping times and costs vary based on location and shipping method selected. We are not responsible 
                for delays caused by customs, weather, or other factors outside our control.
              </p>
              <p>
                Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. 
                You are responsible for filing any claims with carriers for damaged or lost shipments.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">7. Returns and Refunds</h2>
              <p>
                Please refer to our Return Policy for detailed information on returns, exchanges, and refunds. 
                Certain items may be exempt from returns, as specified at the time of purchase.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">8. Intellectual Property</h2>
              <p>
                All content on the Site, including but not limited to text, graphics, logos, images, product designs, 
                and software, is the property of the Company or its content suppliers and is protected by United States 
                and international copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, display, sell, lease, transmit, create derivative works from, or 
                otherwise exploit any content on the Site without our express written permission.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">9. User Conduct</h2>
              <p>
                You agree not to use the Site to:
              </p>
              <ul className="list-disc pl-8 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Submit false or misleading information</li>
                <li>Upload or transmit viruses or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Site</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">10. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED 
                DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-8 mb-4">
                <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SITE</li>
                <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SITE</li>
                <li>ANY CONTENT OBTAINED FROM THE SITE</li>
                <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
                posting on the Site. Your continued use of the Site following the posting of revised Terms means 
                that you accept and agree to the changes.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">12. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at legal@tsarecool.com or at:
              </p>
              <address className="not-italic mb-4">
                Ts Are Cool<br />
                Attn: Legal Department<br />
                123 T-Shirt Lane<br />
                Fashion District<br />
                New York, NY 10001
              </address>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-[#457B9D]" />
                Privacy Policy
              </CardTitle>
              <CardDescription>
                Last updated: March 25, 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none text-gray-600">
              <h2 className="text-xl font-semibold text-[#1D3557] mt-2 mb-4">1. Introduction</h2>
              <p>
                At Ts Are Cool ("Company", "we", "us"), we respect your privacy and are committed to protecting your 
                personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website www.tsarecool.com (the "Site") or make a purchase from us.
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using the Site, you acknowledge that you have 
                read, understood, and agree to be bound by all the terms of this Privacy Policy.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">2. Information We Collect</h2>
              <p>
                <strong>Personal Information:</strong> We may collect personal identification information from users in various ways, 
                including when users visit our Site, register on the Site, place an order, subscribe to the newsletter, 
                respond to a survey, fill out a form, or in connection with other activities, services, features, or 
                resources we make available on our Site. This information may include:
              </p>
              <ul className="list-disc pl-8 mb-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Mailing address</li>
                <li>Phone number</li>
                <li>Payment information</li>
                <li>Demographic information</li>
              </ul>
              <p>
                <strong>Non-Personal Information:</strong> We may collect non-personal identification information about users 
                whenever they interact with our Site. This information may include:
              </p>
              <ul className="list-disc pl-8 mb-4">
                <li>Browser name</li>
                <li>Type of computer</li>
                <li>Technical information about users' connection to our Site</li>
                <li>Referral source</li>
                <li>IP address</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">3. How We Use Your Information</h2>
              <p>
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-8 mb-4">
                <li>To process and fulfill your orders</li>
                <li>To provide customer service and respond to inquiries</li>
                <li>To send periodic emails regarding your orders or other products and services</li>
                <li>To improve our Site and customer experience</li>
                <li>To administer promotions, surveys, or other Site features</li>
                <li>To personalize your experience and deliver content most relevant to you</li>
                <li>For marketing and advertising purposes</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">4. How We Protect Your Information</h2>
              <p>
                We adopt appropriate data collection, storage, and processing practices and security measures to 
                protect against unauthorized access, alteration, disclosure, or destruction of your personal information, 
                username, password, transaction information, and data stored on our Site.
              </p>
              <p>
                Sensitive and private data exchange between the Site and its users happens over an SSL secured 
                communication channel and is encrypted and protected with digital signatures.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">5. Sharing Your Information</h2>
              <p>
                We do not sell, trade, or rent users' personal identification information to others. We may share 
                generic aggregated demographic information not linked to any personal identification information 
                regarding visitors and users with our business partners, trusted affiliates, and advertisers.
              </p>
              <p>
                We may use third-party service providers to help us operate our business and the Site or administer 
                activities on our behalf, such as sending out newsletters or surveys. We may share your information 
                with these third parties for those limited purposes.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">6. Third-Party Websites</h2>
              <p>
                Users may find advertising or other content on our Site that links to the sites and services of our 
                partners, suppliers, advertisers, sponsors, licensors, and other third parties. We do not control the 
                content or links that appear on these sites and are not responsible for the practices employed by 
                websites linked to or from our Site. These sites may have their own privacy policies and customer 
                service policies.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">7. Cookies and Tracking Technologies</h2>
              <p>
                Our Site may use "cookies" to enhance user experience. User's web browsers place cookies on their hard 
                drive for record-keeping purposes and sometimes to track information about them. Users may choose to set 
                their web browser to refuse cookies or to alert you when cookies are being sent. If they do so, some 
                parts of the Site may not function properly.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">8. Children's Privacy</h2>
              <p>
                Our Site is not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If you are under 13, please do not provide any information on this 
                Site.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">9. Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-8 mb-4">
                <li>The right to access personal information we hold about you</li>
                <li>The right to request correction of inaccurate personal information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to withdraw consent to processing</li>
                <li>The right to object to processing for marketing purposes</li>
                <li>The right to data portability</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the information provided at the end of this Policy.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We have the discretion to update this Privacy Policy at any time. When we do, we will revise the 
                updated date at the top of this page. We encourage users to frequently check this page for any changes 
                to stay informed about how we are helping to protect the personal information we collect.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@tsarecool.com or at:
              </p>
              <address className="not-italic mb-4">
                Ts Are Cool<br />
                Attn: Privacy Officer<br />
                123 T-Shirt Lane<br />
                Fashion District<br />
                New York, NY 10001
              </address>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-[#457B9D]" />
                Security Policy
              </CardTitle>
              <CardDescription>
                Last updated: March 25, 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none text-gray-600">
              <h2 className="text-xl font-semibold text-[#1D3557] mt-2 mb-4">Our Commitment to Security</h2>
              <p>
                At Ts Are Cool, we take the security of your personal and payment information seriously. We implement 
                a variety of security measures to maintain the safety of your information when you place an order or 
                enter, submit, or access your personal information.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">Secure Shopping</h2>
              <p>
                All information provided to us is transmitted using Secure Socket Layer (SSL) technology. SSL encrypts 
                your order information to protect it from being decoded by anyone other than us.
              </p>
              <p>
                Furthermore, we comply with the Payment Card Industry Data Security Standard (PCI DSS) to ensure that 
                credit card information submitted to us is securely processed.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">Payment Security</h2>
              <p>
                We do not store your full credit card details on our servers. When you place an order, your credit card 
                information is encrypted and transmitted securely to our payment processor, where it is stored according 
                to industry-standard security practices.
              </p>
              <p>
                We work only with trusted payment partners who maintain strict security standards to protect your payment information.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">Account Security</h2>
              <p>
                Your account is protected by a password for your privacy and security. You are responsible for keeping 
                your password confidential. We recommend:
              </p>
              <ul className="list-disc pl-8 mb-4">
                <li>Using a strong, unique password</li>
                <li>Changing your password regularly</li>
                <li>Not sharing your account credentials with others</li>
                <li>Logging out of your account when using shared computers</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">Security Measures</h2>
              <p>
                We employ the following security measures to protect your information:
              </p>
              <ul className="list-disc pl-8 mb-4">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments and vulnerability scans</li>
                <li>Limited access to personal information by authorized personnel only</li>
                <li>Continuous monitoring for suspicious activities</li>
                <li>Regular updates and patches to our systems and software</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">Reporting Security Concerns</h2>
              <p>
                If you discover a potential security vulnerability or have concerns about the security of our 
                website, please contact us immediately at security@tsarecool.com.
              </p>
              <p>
                We appreciate your help in keeping our Site secure and protecting our customers' information.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">Updates to Our Security Policy</h2>
              <p>
                We regularly review and update our security practices to ensure we maintain high standards of 
                protection. This Security Policy may be updated periodically to reflect changes in our security 
                practices or legal requirements.
              </p>
              
              <h2 className="text-xl font-semibold text-[#1D3557] mt-6 mb-4">Contact Information</h2>
              <p>
                If you have any questions about our security practices, please contact us at security@tsarecool.com or at:
              </p>
              <address className="not-italic mb-4">
                Ts Are Cool<br />
                Attn: Security Team<br />
                123 T-Shirt Lane<br />
                Fashion District<br />
                New York, NY 10001
              </address>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TermsPage;