import { envConfig } from '~/constants/config'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
const Base64 = {
  btoa: (input = '') => {
    const str = input
    let output = ''

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = '='), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4))

      if (charCode > 0xff) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.")
      }

      block = (block << 8) | charCode
    }

    return output
  },

  atob: (input = '') => {
    const str = input.replace(/=+$/, '')
    let output = ''

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.")
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer)
    }

    return output
  }
}

////////Send email API
const createMailOTPForm = (email_verify_link: string) => {
  const html = `<div style='font-family:Helvetica,Arial,sans-serif; min-width:500px; overflow:auto; line-height:2'>
  <div style='margin:50px auto; width:70%; padding:20px 0 '>
      <div style='border-bottom:1px solid #eee;text-align: center'>
      <img src="https://res.cloudinary.com/dyvmhxwr6/image/upload/v1730042613/tx5xnpmqlg4xp3yoyy1w.jpg" alt="Logo" style="vertical-align: middle;width:200px;height:200px">
      <a style='display:block;font-size: 1.4em; color: #303f9f; text-decoration: none; font-weight: 600;margin-top: 10px;margin-bottom: 10px '>
    
      FreshFit
    </a>

      </div>
      <p style='font-size:1.1em'>Hello You,</p>
      <p>The system has received a request to verify email. Please click on the link below to continue. Note, the link is only valid for 5 minutes.</p>
      <h2 style='background:#303f9f; margin:0 auto; width:max-content; padding:0 10px; color:#fff; border-radius:4px; padding: 10px;padding-bottom:15px'><a href=${email_verify_link} style="width:230px;font-family:'Nunito Sans',Arial,Verdana,Helvetica,sans-serif;font-size:14px;line-height:21px;font-weight:600;color:#fff;text-decoration:none;text-align:center;display:inline-block" target="_blank" >Verify Email</a></h2>

      <p style='font-size:0.9em;'>Best regard.<br />FreshFit</p>
      <hr style='border:none; border-top:1px solid #eee' />
      <div style='float:right; padding:8px 0; color:#aaa; font-size:0.8em; line-height:1; font-weight:300'>
          <p align='right'>FreshFit - KTPM2021</p>
          <p>University of Information Technology - ĐHQG TP.HCM</p>
      </div>
  </div>
</div>`
  return html
}

const createMailForgotPasswordForm = (otp_code: string) => {
  const html = ` <div style='font-family:Helvetica,Arial,sans-serif; min-width:500px; overflow:auto; line-height:2'>
  <div style='margin:50px auto; width:70%; padding:20px 0 '>
      <div style='border-bottom:1px solid #eee;text-align: center'>
      <img src="https://res.cloudinary.com/dyvmhxwr6/image/upload/v1730042613/tx5xnpmqlg4xp3yoyy1w.jpg" alt="Logo" style="vertical-align: middle;width:200px;height:200px">
      <a style='display:block;font-size: 1.4em; color: #303f9f; text-decoration: none; font-weight: 600;margin-top: 10px;margin-bottom: 10px '>
    
      FreshFit
    </a>

      </div>
      <p style='font-size:1.1em'>Hello You,</p>
      <p>The system has received a request to reset password. Please enter the code below to continue. Note, the code is only valid for 5 minutes.</p>
      <h2 style='background:#303f9f; margin:0 auto; width:max-content; padding:0 10px; color:#fff; border-radius:4px; padding: 10px;padding-bottom:15px'>${otp_code}</h2>
      <p style='font-size:0.9em;'>Best regard.<br />FreshFit</p>
      <hr style='border:none; border-top:1px solid #eee' />
      <div style='float:right; padding:8px 0; color:#aaa; font-size:0.8em; line-height:1; font-weight:300'>
          <p align='right'>FreshFit - KTPM2021</p>
          <p>University of Information Technology - ĐHQG TP.HCM</p>
      </div>
  </div>
</div>`
  return html
}
export async function sendVerifyEmail({ email, email_verify_token }: { email: string; email_verify_token: string }) {
  const email_verify_link = `${envConfig.host}/verify-email?email-verify-token=${email_verify_token}`

  const MJ_APIKEY_PUBLIC = '97ef95802cb73fd61a383fc8a41491f0'
  const MJ_APIKEY_PRIVATE = '1e860af0fcbefa2ddc4f51d028b1ecff'
  const mailContent = {
    FromEmail: 'manhphuoc58@gmail.com',
    FromName: 'FreshFit',
    Subject: 'Verify Email',
    'Html-part': '',
    Recipients: [
      {
        Email: email
      }
    ]
  }
  mailContent['Html-part'] = createMailOTPForm(email_verify_link)
  // body: JSON.stringify({
  //   FromEmail: "manhphuoc58@gmail.com",
  //   FromName: "Cinema Master",
  //   Subject: "OTP code for reset password",
  //   "Text-part": `OTP code: ${content}`,
  //   Recipients: [
  //     {
  //       Email: email,
  //     },
  //   ],
  // }),
  const response = await fetch('https://api.mailjet.com/v3/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Base64.btoa(MJ_APIKEY_PUBLIC + ':' + MJ_APIKEY_PRIVATE)
    },
    // body: '{\n\t\t"FromEmail":"pilot@mailjet.com",\n\t\t"FromName":"Mailjet Pilot",\n\t\t"Subject":"Your email flight plan!",\n\t\t"Text-part":"Dear passenger, welcome to Mailjet! May the delivery force be with you!",\n\t\t"Html-part":"<h3>Dear passenger, welcome to <a href=\\"https://www.mailjet.com/\\">Mailjet</a>!<br />May the delivery force be with you!",\n\t\t"Recipients":[{"Email":"passenger@mailjet.com"}]\n\t}',
    body: JSON.stringify(mailContent)
  }).then((response) => response)
  return response
}

export async function sendForgotPasswordEmail({ email, otp_code }: { email: string; otp_code: string }) {
  const MJ_APIKEY_PUBLIC = '97ef95802cb73fd61a383fc8a41491f0'
  const MJ_APIKEY_PRIVATE = '1e860af0fcbefa2ddc4f51d028b1ecff'
  const mailContent = {
    FromEmail: 'manhphuoc58@gmail.com',
    FromName: 'FreshFit',
    Subject: 'Reset password',
    'Html-part': '',
    Recipients: [
      {
        Email: email
      }
    ]
  }
  mailContent['Html-part'] = createMailForgotPasswordForm(otp_code)
  // body: JSON.stringify({
  //   FromEmail: "manhphuoc58@gmail.com",
  //   FromName: "Cinema Master",
  //   Subject: "OTP code for reset password",
  //   "Text-part": `OTP code: ${content}`,
  //   Recipients: [
  //     {
  //       Email: email,
  //     },
  //   ],
  // }),
  const response = await fetch('https://api.mailjet.com/v3/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Base64.btoa(MJ_APIKEY_PUBLIC + ':' + MJ_APIKEY_PRIVATE)
    },
    // body: '{\n\t\t"FromEmail":"pilot@mailjet.com",\n\t\t"FromName":"Mailjet Pilot",\n\t\t"Subject":"Your email flight plan!",\n\t\t"Text-part":"Dear passenger, welcome to Mailjet! May the delivery force be with you!",\n\t\t"Html-part":"<h3>Dear passenger, welcome to <a href=\\"https://www.mailjet.com/\\">Mailjet</a>!<br />May the delivery force be with you!",\n\t\t"Recipients":[{"Email":"passenger@mailjet.com"}]\n\t}',
    body: JSON.stringify(mailContent)
  }).then((response) => response)
  return response
}
