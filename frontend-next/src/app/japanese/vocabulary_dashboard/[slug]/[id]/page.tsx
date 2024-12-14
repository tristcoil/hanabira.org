import VocabularyHead from "@/components/VocabularyHead";
import ItemsSentences from "@/components/ItemsSentences";


export default async function VocabularyDashboard({params,}: {params: { slug: string, id: string }}) {
    console.log('----------------------------------')
    console.log(params)
  
    return (
    <div className="p-5">
        <VocabularyHead />
        <ItemsSentences params={params} />
    </div>
  );
}




