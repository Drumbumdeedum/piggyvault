import Link from "next/link";

export default async function Index() {
  return (
    <div className="space-y-6 my-12">
      <h1 className="font-bold text-3xl text-center">Privacy Policy</h1>
      <p>
        This Privacy Policy describes how your personal information is
        collected, used, and shared when you visit, fill in a form, or use the
        services provided on piggyvault.me (the “Site”).
      </p>
      <h2 className="font-semibold text-2xl">
        PERSONAL INFORMATION WE COLLECT
      </h2>
      <p>
        When you visit the Site, we automatically collect certain information
        about your device, including details about your web browser, IP address,
        time zone, and some of the cookies installed on your device.
        Additionally, as you browse the Site, we gather information about the
        individual web pages you view, the websites or search terms that
        referred you to the Site, and how you interact with the Site. We refer
        to this automatically collected data as “Device Information.”
      </p>
      <div className="space-y-3">
        <p>We collect Device Information using the following technologies:</p>
        <ul className="list-disc pl-6">
          <li>
            Cookies: These are data files placed on your device that often
            include an anonymous unique identifier. For more information on
            cookies and how to disable them, visit www.allaboutcookies.org.
          </li>
          <li>
            Log Files: These track actions occurring on the Site and collect
            data including your IP address, browser type, Internet service
            provider, referring/exit pages, and date/time stamps.
          </li>
          <li>
            Web Beacons, Tags, and Pixels: These electronic files record
            information about how you browse the Site.
          </li>
        </ul>
      </div>
      <p>
        Additionally, when you fill in a form or use any features of the Site,
        we collect certain personal information from you, such as your name,
        email address, phone number, and any financial data you may provide for
        the purposes of using our personal finance management services. We refer
        to this information as “Contact Information.”
      </p>
      <p>
        When we refer to “Personal Information” in this Privacy Policy, we are
        referring to both Device Information and Contact Information.
      </p>
      <h2 className="font-semibold text-2xl">
        HOW DO WE USE YOUR PERSONAL INFORMATION?
      </h2>
      <div className="space-y-3">
        <p>We use the Contact Information that we collect to:</p>
        <ul className="list-disc pl-6">
          <li>Provide the services and tools you request through the Site;</li>
          <li>Communicate with you;</li>
          <li>Screen our requests for potential risk or fraud;</li>
          <li>
            Provide you with information or advertising related to our products
            or services in line with your preferences.
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <p>We use the Device Information to:</p>
        <ul className="list-disc pl-6">
          <li>
            Help us screen for potential risk and fraud (especially using your
            IP address);
          </li>
          <li>
            Improve and optimize our Site (for example, by generating analytics
            about how our users browse and interact with the Site);
          </li>
          <li>
            Evaluate the success of our marketing and advertising campaigns.
          </li>
        </ul>
      </div>
      <h2 className="font-semibold text-2xl">
        SHARING YOUR PERSONAL INFORMATION
      </h2>
      <p>
        We share your Personal Information with third parties to help us use
        your information as described above.
      </p>
      <p>
        Finally, we may also share your Personal Information to comply with
        applicable laws and regulations, respond to subpoenas, search warrants,
        or other lawful requests for information we receive, or to protect our
        rights.
      </p>
      <h2 className="font-semibold text-2xl">YOUR RIGHTS</h2>
      <p>
        If you are a European resident, you have the right to access personal
        information we hold about you and request that it be corrected, updated,
        or deleted. To exercise this right, please contact us using the contact
        details below.
      </p>
      <p>
        Additionally, if you are a European resident, we process your
        information to fulfill contracts we might have with you (for example,
        providing financial management services through the Site), or otherwise
        to pursue our legitimate business interests. Please note that your
        information will be transferred outside of Europe, including to Canada
        and the United States.
      </p>
      <h2 className="font-semibold text-2xl">DATA RETENTION</h2>
      <p>
        When you submit information through the Site, we will maintain your
        Contact Information for our records unless and until you request that we
        delete this information.
      </p>
      <h2 className="font-semibold text-2xl">CHANGES</h2>
      <p>
        We may update this privacy policy from time to time to reflect changes
        to our practices, or for other operational, legal, or regulatory
        reasons.
      </p>
      <h2 className="font-semibold text-2xl">CONTACT US</h2>
      <p>
        For more information about our privacy practices, if you have any
        questions, or if you would like to make a complaint, please contact us
        by email at hello@piggyvault.me.
      </p>
    </div>
  );
}
