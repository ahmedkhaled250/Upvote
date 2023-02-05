import { userModel } from "../DB/model/user.model.js";
import { nodeEmail } from "./sendemail.js";

export default async function scheduleFunction() {
  const users = await userModel.find().where('age').gt(20);
  for (const user of users) {
    await nodeEmail(user.email,'Cv','<h1>Cv</h1>',
    [{
        filename: 'text1.txt',
        path: 'https://res.cloudinary.com/dlub8w5jc/raw/upload/v1668146906/user/cv_template_p3k4mh.docx',
        encoding: 'base64'
    }]);
  }
  console.log('running');
}
