// import { useEffect, useState } from "react";

// export function creditCheck(user, supabase) {
//   "use server";
//   const [userCredits, setUserCredits] = useState(null);

//   if (user) {
//     useEffect(() => {
//       const fetchUserCredits = async () => {
//         const { data, error } = await supabase
//           .from("user_credits")
//           .select("*")
//           .eq("user_id", user.id);

//         if (error) {
//           console.log(error);
//         } else {
//           setUserCredits(data);
//         }
//       };

//       if (user) {
//         fetchUserCredits();
//       }
//     }, [user, supabase]);
//   } else {
//     return;
//   }
//   return userCredits;
// }
