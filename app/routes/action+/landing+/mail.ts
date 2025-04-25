import { ActionFunctionArgs } from "@remix-run/node";
import emailjs from "@emailjs/nodejs";
import { ActionResult } from "~/types/action-result";

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<ActionResult<any>> => {
  const formData = await request.formData();
  const email = formData.get("email");
  const name = formData.get("name");
  const message = formData.get("message");
  console.log(`Email: ${email}, Name: ${name}, Message: ${message}`);
  console.log(
    "Sending email...\n",
    process.env.REACT_APP_MAIL_SERVICE_ID,
    "\n",
    process.env.REACT_APP_MAIL_TEMPLATE_ID,
    "\n",
    process.env.REACT_APP_MAIL_PUBLIC_KEY
  );
  if (name && email && message) {
    emailjs
      .send(
        process.env.REACT_APP_MAIL_SERVICE_ID as string,
        process.env.REACT_APP_MAIL_TEMPLATE_ID as string,
        {
          from_name: name,
          to_name: "Harsha Leo",
          from_email: email,
          to_email: "saiharsha9897@gmail.com",
          message: message,
        },
        {
          publicKey: process.env.REACT_APP_MAIL_PUBLIC_KEY as string,
        }
      )
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        return {
          success: false,
          origin: "email",
          message: "Error sending email",
          data: null,
        };
      });
  }
  // Send email using EmailJS
  return {
    success: true,
    origin: "email",
    message: "Email sent successfully",
    data: null,
  };
};

// const handleSubmit = (e: any) => {
//     e.preventDefault();
//     setLoading(true);
//     console.log(form);
//     if (!form.name || !form.email || !form.message) {
//       toast({
//         variant: "destructive",
//         title: "Please fill all the fields.",
//         description: "All fields are required.",
//       });
//       return;
//     }
//     emailjs
//       .send(
//         process.env.VITE_APP_EMAILJS_SERVICE_ID,
//         process.env.VITE_APP_EMAILJS_TEMPLATE_ID,
//         {
//           from_name: form.name,
//           to_name: "Harsha Leo",
//           from_email: form.email,
//           to_email: "saiharsha9897@gmail.com",
//           message: form.message,
//         },
//         process.env.VITE_APP_EMAILJS_PUBLIC_KEY
//       )
//       .then(
//         () => {
//           setLoading(false);
//           toast({
//             title: "Thank you.",
//             description: "I will get back to you as soon as possible.",
//           });

//           setForm({
//             name: "",
//             email: "",
//             message: "",
//           });
//         },
//         (error: any) => {
//           setLoading(false);
//           console.error(error);

//           toast({
//             variant: "destructive",
//             title: "Ahh, something went wrong.",
//             description: "Please try again.",
//           });
//         }
//       );
//   };
