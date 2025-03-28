import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  return (
    <>
      <Header />
      <div className="container dark mt-16 md:mt-24 max-w-4xl mx-auto py-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl text-white px-4 text-center font-bold">
              OnGrid Protocol Terms of Service
            </h1>
          </div>
          {/* <Separator /> */}
          <div className="text-gray-300 px-8 md:pt-6">
            <section className="mb-8">
              <h2 className="text-lg font-[700] mb-4">
                BEFORE THE USE OF ANY ONGRID PROTOCOL SERVICE, YOU ARE REQUIRED
                TO READ, UNDERSTAND, AND AGREE TO THESE TERMS. YOU MAY ONLY
                CREATE AN ACCOUNT AFTER HAVING READ AND ACCEPTED THESE TERMS. IF
                YOU DO NOT AGREE TO ALL OF THE CONDITIONS SET FORTH IN THIS
                DOCUMENT, PLEASE REFRAIN FROM USING OUR PRODUCTS AND SERVICES.
              </h2>
              <p>
                The following Terms govern the contractual relationships between
                you and [OnGrid Protocol Limited, a business company
                incorporated in the State of Delaware] (doing business as
                  &ldquo;OnGrid Protocol&ldquo;, also referred to as &ldquo;Company&ldquo;). The Company
                reserves the right to modify or discontinue, temporarily or
                permanently, the Terms of Service in whole or in part with or
                without notice at any time. You agree that the Company shall not
                be liable to you or any third party for any modification,
                suspension, or discontinuance of service. Please also read
                OnGrid Protocol&lsquo;s Privacy Policy which details how the Company
                securely handles your personal information. The Company reserves
                the right to change the Terms of Service, so check back
                periodically for changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">1. Definitions</h2>
              <p className="pb-8">
                The following definitions shall apply in these Terms:
              </p>
              <p className="text-base font-medium mb-2">
                <span className="font-bold text-white text-lg">
                  1.1 &ldquo;OnGrid Protocol Service&ldquo;:{" "}
                </span>
                Services operated by the Company, available as web applications
                (hereinafter, &ldquo;Website&ldquo;) at <a href="www.ongridprotocol.com">www.ongridprotocol.com</a> ; as mobile
                applications on various platforms (hereinafter, &ldquo;Mobile App&ldquo;);
                and through node devices and related software.
              </p>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  1.2 &ldquo;Service&ldquo;:{" "}
                </span>
                Unless otherwise specified, &ldquo;Service&ldquo; in these Terms refers to
                all services provided on the OnGrid Protocol platform.
              </p>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  1.3 &ldquo;User&ldquo; or &ldquo;you&ldquo;:{" "}
                </span>
                Any natural person, legal entity, or legally responsible
                partnership who accesses the Service, with or without
                registration.
              </p>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  1.4 &ldquo;Node&ldquo;:{" "}
                </span>
                Hardware devices or software applications that participate in
                the OnGrid Protocol network for renewable energy data
                collection, carbon credit mining, and related operations.
              </p>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  1.5 &ldquo;Node Data&ldquo;:{" "}
                </span>
                Information collected from OnGrid Protocol nodes, including but
                not limited to energy data, device status, and verification
                records.
              </p>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  1.6 &ldquo;Blockchain Data&ldquo;:{" "}
                </span>
                Public information recorded on the blockchain related to your
                account, transactions, node operations, and other network
                activities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">
                2. Service Registration
              </h2>
              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  2.1 Eligibility
                </span>
              </p>
              <p>By using the Service, you represent and warrant that:</p>
              <ul className=" list-decimal list-inside">
                <li> You are at least 18 years of age;</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>
                  You are not located in, under the control of, or a national or
                  resident of any restricted jurisdiction.
                </li>
              </ul>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  2.2 Account Creation
                </span>
              </p>
              <p>
                To access certain features of the Service, you must register for
                an account. When you register, you agree to:
              </p>
              <ul className=" list-decimal list-inside">
                <li>Provide accurate, current, and complete information;</li>
                <li>Maintain and update your information as necessary;</li>
                <li>Maintain the security of your account;</li>
                <li>
                  {" "}
                  Accept responsibility for all activities that occur under your
                  account;
                </li>
                <li>
                  Not share your account credentials with any third party.
                </li>
              </ul>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  2.3 Account Security
                </span>
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You agree to promptly notify the Company of any
                unauthorized use of your account or any other breach of
                security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">3. Node Operation</h2>
              <p>
                We shall not be held liable for any damages that result from the
                use of, or inability to use, the materials on our website.
              </p>
              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  3.1 Node Requirements
                </span>
              </p>
              <p>To operate a Node on the OnGrid Protocol network, you must:</p>
              <ul className=" list-decimal list-inside">
                <li>
                  {" "}
                  Use approved hardware devices and software applications;
                </li>
                <li>Maintain stable internet connectivity;</li>
                <li>Comply with all network protocols and rules;</li>
                <li>
                  Keep node software updated to the latest version as provided
                  by OnGrid Protocol.
                </li>
              </ul>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  3.2 Node Data
                </span>
              </p>
              <p>By operating a Node, you agree that:</p>
              <ul className=" list-decimal list-inside">
                <li>
                  {" "}
                  Use approved hardware devices and software applications;
                </li>
                <li>Maintain stable internet connectivity;</li>
                <li>Comply with all network protocols and rules;</li>
                <li>
                  Keep node software updated to the latest version as provided
                  by OnGrid Protocol.
                </li>
              </ul>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  3.3 Operational Responsibilities
                </span>
              </p>
              <p>Node operators are responsible for:</p>
              <ul className="list-decimal list-inside">
                <li>Proper installation and maintenance of Nodes;</li>
                <li>
                  Ensuring accurate reporting of energy data and other relevant
                  metrics;
                </li>
                <li>
                  Maintaining Node uptime and connectivity to the network;
                </li>
                <li>
                  Complying with all applicable local laws and regulations.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">
                4. Intellectual Property Rights
              </h2>
              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  4.1 Ownership
                </span>
              </p>
              <p>
                All rights, title, and interest in and to the Service (excluding
                User Content) are and will remain the exclusive property of
                OnGrid Protocol and its licensors. The Service is protected by
                copyright, trademark, and other laws.
              </p>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  4.2 License Grant
                </span>
              </p>
              <p>
                Subject to these Terms, OnGrid Protocol grants you a limited,
                non-exclusive, non-transferable, non-sublicensable license to
                use the Service for your personal or business purposes.
              </p>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  4.3 Restrictions
                </span>
              </p>
              <p>You shall not:</p>
              <ul className="list-decimal list-inside">
                <li>
                  Copy, modify, or create derivative works of the Service;
                </li>
                <li>
                  Reverse engineer, decompile, or disassemble any aspect of the
                  Service;
                </li>
                <li>
                  Access the Service to build a similar or competitive product;
                </li>
                <li>
                  Use the Service in any manner that could damage or overburden
                  the network.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">5. Token Economy</h2>
              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  5.1 Token Usage
                </span>
              </p>
              <p>Tokens issued on the OnGrid Protocol network:</p>
              <ul className="list-decimal list-inside">
                <li>
                  Represent rewards for verified energy data and network
                  contributions;
                </li>
                <li>
                  May be used within the network ecosystem for transactions,
                  governance, and other purposes;
                </li>
                <li>Are subject to applicable laws and regulations.</li>
              </ul>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  5.2 Rewards
                </span>
              </p>
              <p>
                Node operators and participants may receive rewards based on:
              </p>
              <ul className="list-decimal list-inside">
                <li>Verified energy data contributions;</li>
                <li>Node performance and uptime;</li>
                <li>
                  Other network participation metrics determined by the Company.
                </li>
              </ul>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  5.3 Compliance
                </span>
              </p>
              <p>You must comply with all applicable laws regarding:</p>
              <ul className="list-decimal list-inside">
                <li>Token ownership and transfer;</li>
                <li>Tax obligations;</li>
                <li>Regulatory requirements.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">
                6. Network Participation
              </h2>
              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  6.1 General Obligations
                </span>
              </p>
              <p>Participants in the OnGrid Protocol network must:</p>
              <ul className="list-decimal list-inside">
                <li>Act in good faith;</li>
                <li>Provide accurate information where requested;</li>
                <li>Comply with network rules and protocols;</li>
                <li>Maintain necessary security standards.</li>
              </ul>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  6.2 Prohibited Activities
                </span>
              </p>
              <p>Users shall not engage in:</p>
              <ul className="list-decimal list-inside">
                <li>Fraudulent data reporting or manipulation;</li>
                <li>Attempts to disrupt or manipulate the network;</li>
                <li>Unauthorized access attempts;</li>
                <li>
                  Any activity that could harm the network or its participants.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">
                7. Billing and Payments
              </h2>
              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  7.1 Payment Terms
                </span>
              </p>
              <p>
                Users agree to pay all applicable fees and charges for services
                used on the OnGrid Protocol network. Payments may be required
                for, but are not limited to:
              </p>
              <ul className="list-decimal list-inside">
                <li>Node activation or registration fees;</li>
                <li>Premium or enhanced services;</li>
                <li>Network transactions where applicable.</li>
              </ul>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  7.2 Refunds
                </span>
              </p>
              <p>
                Refund policies vary by service type and will be specified in
                relevant service agreements or documentation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">
                8. Liability and Indemnification
              </h2>
              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  8.1 Limitation of Liability
                </span>
              </p>
              <p className="uppercase">
                To the maximum extent permitted by law, OnGrid Protocol shall
                not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from your use or
                inability to use the service.
              </p>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  8.2 Indemnification
                </span>
              </p>
              <p>
                You agree to indemnify and hold harmless OnGrid Protocol from
                any claims arising from:
              </p>
              <ul className="list-decimal list-inside">
                <li>Your use of the Service;</li>
                <li>Your violation of these Terms;</li>
                <li>Your violation of any rights of another party.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">
                9. Governing Law & Dispute Resolution
              </h2>
              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  9.1 Governing Law
                </span>
              </p>
              <p>
                These Terms shall be governed by the laws of the British Virgin
                Islands, without regard to its conflict of law provisions.
              </p>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  9.2 Dispute Resolution
                </span>
              </p>
              <p>
                Any dispute arising from these Terms shall be resolved through:
              </p>
              <ul className="list-decimal list-inside">
                <li>Good-faith negotiation;</li>
                <li>Mediation if necessary;</li>
                <li>
                  Legal proceedings in the courts of the State of Delaware.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  10.1 Modification Rights
                </span>
              </p>
              <p>
                OnGrid Protocol reserves the right to modify these Terms at any
                time. Significant changes will be communicated to users as
                appropriate.
              </p>

              <p className="text-base font-medium mb-2 mt-4">
                <span className="font-bold text-white text-lg">
                  10.2 Continued Use
                </span>
              </p>
              <p>
                Continued use of the Service after modifications constitutes
                acceptance of the modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl text-white font-semibold mb-4">11. Contact</h2>
              <p>For questions about these Terms, please contact:</p>
              <p>
                <strong className="text-white block mt-4  font-bold">Email: {" "}</strong>
                <a className="" href="href=”mailto:info@ongridprotocol.com">
                  info@ongridprotocol.com
                </a>
              </p>
            </section>
          </div>

          <Separator className="px-4 bg-gray-500 max-w-[90%] mx-auto"/>
          <p className="text-gray-300 italic px-8">
            By creating an account or using the OnGrid Protocol Service, you
            acknowledge that you have read, understood, and agree to be bound by
            these Terms of Service.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
