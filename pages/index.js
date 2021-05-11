import useSWR from 'swr';
import Link from "next/link"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Home(){
  const home = useSWR('/api/page/sample-page', fetcher);
  const recent = useSWR('/api/post/recent', fetcher);
  
  if(home.error) return <div>Error...</div>
  if(!home.data) return <div>Loading...</div>

  return(
    <div>
      <h1>{home.data.page.title}</h1>
      <div dangerouslySetInnerHTML={{__html: home.data.page.content}} />

      {
        recent.data?.posts.edges.map(({node}) => (
          <div key={node.slug}>
            <h3>{node.title}</h3>
            <img src={node.featuredImage?.node?.sourceUrl} alt="featured"/>
            <div dangerouslySetInnerHTML={{__html: node.excerpt}} />
            <Link href={node.slug}>
              <a>
                Read Post
              </a>
            </Link>
          </div>
        ))
      }
      
    </div>
  )

}

