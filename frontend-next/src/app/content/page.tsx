import CategoriesHeader from "@/components/CategoriesHeader"
import Category from "@/components/Category"

//import japanese6000 from '../../public/img/Japanese6000.png'
import japanese6000 from '@public/img/Japanese6000.png'

export default function Home() {
  return (
<>
      <CategoriesHeader />
      
      {/* JLPT N3 Overall Content */}
      <Category
        img={japanese6000}
        title="JLPT Japanese Essentials"
        titleDes="Essential Japanese Vocabulary, Grammar and Kanji for JLPT N5-N1 level."
        icon="/img/grammer.png"
        courses="22"
        series="5"
        des="
        Master Japanese with our focused JLPT N5-N1 course, designed to strengthen your 
        vocabulary, grammar, and kanji knowledge. 
        Dive into straightforward lessons that make learning enjoyable. 
        Improve your language skills and gain confidence as you tackle our JLPT learning materials. 
        Join our course now and start your exciting Japanese learning adventure!"
      />

</>
  )
}




































// export default function Home() {
//   return (
//     <div className="h-screen flex flex-col">
//       <div className="flex-shrink-0">
//         {/* <Nav /> */}
//       </div>
//       <div className="flex-1">
//         <div className="grid lg:grid-cols-body">
//           <Sidebar />
//           <div className="flex flex-col flex-shrink-0">
//             <Nav />
//             <DashboardNav />


//             <p>lolololololololololo</p>

//             {/* <GrammarTitles pTag="JLPT_N5" /> */}




//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }












