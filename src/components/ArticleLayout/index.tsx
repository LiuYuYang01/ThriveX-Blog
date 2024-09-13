import Pagination from "../Pagination"
import Classics from "./Classics"
import { getArticleListAPI } from '@/api/article'

export default async ({ page }: { page: number }) => {
  const { data } = await getArticleListAPI(page)

  return (
    <>
      <div className="w-full md:w-[90%] lg:w-[68%] xl:w-[73%] mx-auto transition-width">
        <Classics data={data}></Classics>

        <Pagination total={data.pages} page={page} className="flex justify-center mt-5" />
      </div>
    </>
  )
}