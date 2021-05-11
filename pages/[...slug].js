import { useRouter } from "next/router";
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Page({slug}){

  const {data,error} = useSWR(`/api/page/${slug}`, fetcher);
  
  if(error) return <div>Error...</div>
  if(!data) return <div>Loading...</div>


  return(
    <div>
      <h1>{data.page.title}</h1>
      <div dangerouslySetInnerHTML={{__html: data.page.content}} />
    </div>
  )

}

export async function getStaticProps({params}) {

  const slug = params.slug.join('/');
  return {
    props: {
      slug
    }
  }
}

export async function getStaticPaths() {

  const QUERY_ALL_PAGES = `
  query AllPagesQuery {
    pages {
      edges {
        node {
          uri
        }
      }
    }
  }
  `;

  const allPages = await fetch(process.env.WORDPRESS_LOCAL_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      query: QUERY_ALL_PAGES,
    })
  } );

  const json = await allPages.json();
  
  const pages = json.data.pages.edges;
  
  const paths = pages.map((page) => (
      {
        params: {
          slug: page.node.uri.split("/").filter((i) => i)
        }
      }
    )
  )

  return {
    paths: paths || [],
    fallback: true
  }
}
