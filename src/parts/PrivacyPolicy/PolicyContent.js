import React from 'react'
import writeLocalization from 'src/helpers/localization'

export default function PolicyContent(props) {
  const lang = {}
  const RenderNumbering = (data) => {
    return data.map((item, index) => (
      <div className="my-2" key={index}>
        <div className="flex">
          <div className="mr-1">{index + 1}.</div>
          <div>{item}</div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <p className="mb-3" >
        {writeLocalization(
          lang?.text__description_PRIVACY_POLICY_1 || '[0] is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement',
          [<b>{props?.shopInfo?.shop_name}</b>]
        )}
      </p>

      <p className="mb-3" >
        {lang?.text__description_PRIVACY_POLICY_2 || 'This Privacy Policy provides an explanation as to what happens to any personal data that you provide to us, or that we collect from you.'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_PRIVACY_POLICY_3 || 'We may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. This policy is effective from social commerce site launch month.'}
      </p>

      <h5 className="font-bold mb-2 mt-6">
        {lang?.text__title_INFORMATION_WE_COLLECT || 'INFORMATION WE COLLECT'}
      </h5>
      <p className="mb-3" >
        {lang?.text__description_INFORMATION_WE_COLLECT_1 || 'Details of your visits to our website and the resources that you access, including, but not limited to, traffic data, location data, weblogs, and other communication data.'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_INFORMATION_WE_COLLECT_2 || 'Information that you provide by filling in forms on our website, such as when you sign up to our newsletter, register for information or make a purchase.'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_INFORMATION_WE_COLLECT_3 || 'Information provided to us when you communicate with us for any reason.'}
      </p>

      <h5 className="font-bold mb-2 mt-6">
        {lang?.text__title_USE_OF_COOKIES || 'USE OF COOKIES'}
      </h5>
      <p className="mb-3" >
        {lang?.text__description_USE_OF_COOKIES_1 || 'On occasion, we may gather information about your computer for our services and to provide statistical information regarding the use of our website to our advertisers. Such information will not identify you personally it is statistical data about our visitors and their use of our site. This statistical data does not identify any personal details whatsoever.'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_USE_OF_COOKIES_2 || 'Similarly, to the above, we may gather information about your general internet use by using a cookie file. A cookie is a small file which asks permission to be placed on your computer’s hard drive. Once you agree, the file is added, and the cookie helps analyze web traffic or let you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_USE_OF_COOKIES_3 || 'All computers can automatically accept or decline cookies. This can be done by activating the setting on your browser which determines how to deal with cookies. Please note that should you choose to decline cookies; you may be unable to access parts of our website. Our advertisers may also use cookies, over which we have no control. Such cookies (if used) would be downloaded once you click on advertisements on our website.'}
      </p>

      <h5 className="font-bold mb-2 mt-6">
        {lang?.text__title_USE_OF_INFORMATION || 'USE OF YOUR INFORMATION'}
      </h5>
      <p className="mb-3" >
        {lang?.text__description_USE_OF_INFORMATION_1 || 'The information that we collect and store relating to you is primarily used to enable us to provide our services to you. In addition, we may use the information for the following purposes:'}
        <span className="mb-2"></span>
        {RenderNumbering([
          lang?.text__description_USE_OF_INFORMATION_1_1 || 'To provide you with information requested from us, relating to our products or services. To provide information on other products which we feel may be of interest to you, where you have consented to receive such information.',
          lang?.text__description_USE_OF_INFORMATION_1_2 || 'To meet our contractual commitments to you.',
          lang?.text__description_USE_OF_INFORMATION_1_3 || 'To notify you about any changes to our website, such as improvements or service/product changes, that may affect our service.',
        ])}
      </p>
      <p className="mb-3" >
        {lang?.text__description_USE_OF_INFORMATION_2 || 'If you are an existing customer, we may contact you with information about goods and services like those which were the subject of a previous sale to you.'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_USE_OF_INFORMATION_3 || 'Further, we may use your data so that you can be provided with information about unrelated goods and services which we consider may be of interest to you. We may contact you about these goods and services by any of the methods that you consented at the time your information was collected.'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_USE_OF_INFORMATION_4 || 'If you are a new customer, we will only contact you or allow third parties to contact you only when you have provided consent and only by those means you provided consent for.'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_USE_OF_INFORMATION_5 || 'If you do not want us to use your data for our or third parties you will have the opportunity to withhold your consent to this when you provide your details to us on the form on which we collect your data.'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_USE_OF_INFORMATION_6 || 'Please be advised that we do not reveal information about identifiable individuals to our advertisers, but we may, on occasion, provide them with aggregate statistical information about our visitors.'}
      </p>

      <h5 className="font-bold mb-2 mt-6">
        {lang?.text__title_STORING_YOUR_PERSONAL_DATA || 'STORING YOUR PERSONAL DATA'}
      </h5>
      <p className="mb-3" >
        {lang?.text__description_STORING_YOUR_PERSONAL_DATA_1 || 'Data that is provided to us is stored on our secure servers. Details relating to any transactions entered on our site will be encrypted to ensure its safety.'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_STORING_YOUR_PERSONAL_DATA_2 || 'The transmission of information via the internet is not completely secure and therefore we cannot guarantee the security of data sent to us electronically and transmission of such data is therefore entirely at your own risk. Where we have given you (or where you have chosen) a password so that you can access certain parts of our site, you are responsible for keeping this password confidential.'}
      </p>

      <h5 className="font-bold mb-2 mt-6">
        {lang?.text__title_DISCLOSING_YOUR_INFORMATION || 'DISCLOSING YOUR INFORMATION'}
      </h5>
      <p className="mb-3" >
        {lang?.text__description_DISCLOSING_YOUR_INFORMATION_1 || 'Where applicable, we may disclose your personal information to any member of our group. This includes, where applicable, our subsidiaries, our holding company, and its other subsidiaries (if any).'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_DISCLOSING_YOUR_INFORMATION_2 || 'We may also disclose your personal information to third parties:'}
        <span className="mb-2"></span>
        {RenderNumbering([
          lang?.text__description_DISCLOSING_YOUR_INFORMATION_2_1 || 'Where we sell any or all our business and/or our assets to a third party.',
          lang?.text__description_DISCLOSING_YOUR_INFORMATION_2_2 || 'Where we are legally required to disclose your information.',
          lang?.text__description_DISCLOSING_YOUR_INFORMATION_2_3 || 'To assist fraud protection and minimize credit risk.',
        ])}
      </p>

      <h5 className="font-bold mb-2 mt-6">
        {lang?.text__title_THIRD_PARTY_LINK || 'THIRD PARTY LINKS'}
      </h5>
      <p className="mb-3" >
        {lang?.text__description_THIRD_PARTY_LINK_1 || 'You might find links to third party websites on our website. These websites should have their own privacy policies which you should check. We do not accept any responsibility or liability for their policies whatsoever as we have no control over them.'}
      </p>

      <h5 className="font-bold mb-2 mt-6">
        {lang?.text__title_ACCESS_TO_INFORMATION || 'ACCESS TO INFORMATION'}
      </h5>
      <p className="mb-3" >
        {lang?.text__description_ACCESS_TO_INFORMATION_1 || 'Should you wish to receive details that we hold about you please contact us using the contact details below.'}
      </p>

      <h5 className="font-bold mb-2 mt-6">
        {lang?.text__description_CONTACTING_US || 'CONTACTING US'}
      </h5>
      <p className="mb-3" >
        {lang?.text__description_CONTACTING_US_1 || 'We welcome any queries, comments, or requests you may have regarding this Privacy Policy.'}
      </p>
      <p className="mb-3" >
        {lang?.text__description_CONTACTING_US_2 || 'Please do not hesitate to email us at'}
      </p>
      <p className="mb-3" >
        {writeLocalization(lang?.text__description_CONTACTING_US_3 || '[0] or contact us at [1]',
          [props?.shopInfo?.shop_email, props?.shopInfo?.phone_no]
        )}
      </p>

      <h5 className="font-bold mb-2 mt-6">
        {lang?.text__title_YOUR_CONSENT || 'YOUR CONSENT'}
      </h5>
      <p className="mb-3" >
        {lang?.text__description_YOUR_CONSENT_1 || 'By using this site, you consent to the collection and use of information as outlined in the above documentation. If we decide to change our privacy policy, we will post those changes on this page so that you are always aware of what information we collect, how we use it, and under what circumstances we disclose it.'}
      </p>
    </>
  )
} 