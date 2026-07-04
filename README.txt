ARAMAZD ART V2 — Supabase connected version

Ինչ կա այս տարբերակում
- Իրական գրանցում / մուտք Supabase Auth-ով
- Checkout էջ՝ demo վճարման պատուհանով
- Պատվերը ստեղծվում է Supabase orders աղյուսակում
- Հեքիաթ, Ֆոտոալբոմ, ArtBook, Ներկիր ինքդ քեզ՝ բոլորը կապված են checkout flow-ին
- Account Dashboard՝ հաճախորդը տեսնում է միայն իր պատվերները
- Admin Panel՝ admin role ունեցող օգտատերը տեսնում է բոլոր պատվերները և փոխում է status / paid_amount

Մինչ GitHub-ում դնելը
1. Supabase SQL Editor-ում բացեք և Run արեք SUPABASE_SQL_SETUP.sql ֆայլի կոդը։
2. Կայքում գրանցվեք ձեր email-ով։
3. Supabase SQL Editor-ում ձեր email-ը դարձրեք admin՝
   update profiles set role = 'admin' where id = (select id from auth.users where email = 'YOUR_EMAIL_HERE');
4. GitHub-ում upload արեք այս ZIP-ի բոլոր ֆայլերը՝ repository root-ում։
5. Բացեք /register.html, ստեղծեք հաշիվ, հետո փորձեք ապրանքի պատվեր։

Վճարումը հիմա demo է։ IDBank/Idram/VPOS տվյալները ստանալուց հետո checkout.html-ում վճարման կոճակը կփոխարինվի իրական վճարման gateway-ով։
