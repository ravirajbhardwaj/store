// try {
//   const { data, error } = await resend.emails.send({
//     from: 'Acme <onboarding@resend.dev>',
//     to: ['delivered@resend.dev'],
//     subject: 'Hello world',
//     html: '<p>Hello world</p>',
//   });

//   if (error) {
//     return Response.json({ error }, { status: 500 });
//   }

//   return Response.json({ data });
// } catch (error) {
//   return Response.json({ error }, { status: 500 });
// }
