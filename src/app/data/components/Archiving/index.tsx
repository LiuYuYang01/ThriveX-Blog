"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"

import { Article } from "@/types/app/article"

import { Accordion, AccordionItem, Spinner } from "@heroui/react";

import archiving from './svg/archiving.svg'
import { AiOutlineEye } from "react-icons/ai";
import dayjs from "dayjs";

interface MonthData {
    total: number;
    list: Article[];
    wordCount: number;
}

interface YearData {
    year: number;
    total: number;
    month: Record<number, MonthData>;
    wordCount: number;
}

const Title = ({ data }: { data: YearData }) => {
    return (
        <div>
            <div className="text-xl font-sans inline-block text_markSty">{data.year} 年 {(data.wordCount / 1000) > 50 && '🔥'}</div>
            <div className="dark:text-[#86909c]">总共发布了：<span className="text-primary">{data.total}</span> 篇文章</div>
            <div className="dark:text-[#86909c]">总字数约：<span className="text-primary">{(data.wordCount / 1000).toFixed(2)}</span> K</div>
        </div>
    )
}

export default ({ list }: { list: Article[] }) => {
    const [result, setResult] = useState<YearData[]>([])
    const getArticleList = async () => {
        const result = groupByYearAndMonth(list);
        // 从早到晚排序
        result.sort((a, b) => b.year - a.year)
        setResult(result)
    }

    // 将文章进行分组
    function groupByYearAndMonth(data: Article[]): YearData[] {
        const groupedData: Record<number, YearData> = {};

        data.forEach(item => {
            const date = new Date(+item.createTime!);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const wordCount = item.content ? item.content.length : 0;

            if (!groupedData[year]) {
                groupedData[year] = { year, total: 0, month: {}, wordCount: 0 };
            }

            if (!groupedData[year].month[month]) {
                groupedData[year].month[month] = { total: 0, list: [], wordCount: 0 };
            }

            groupedData[year].month[month].list.push(item);
            groupedData[year].month[month].total++;
            groupedData[year].total++;
            groupedData[year].wordCount += wordCount;
            groupedData[year].month[month].wordCount += wordCount;
        });

        return Object.values(groupedData);
    }

    useEffect(() => {
        getArticleList()
    }, [list])

    return (
        <>
            {/* <div className="w-3/6 mx-auto"> */}
            <div className="">
                <h3 className="flex justify-center items-center text-2xl mb-3"><Image src={archiving.src} alt="归档" width={36} height={36} className="mr-3" /> 文章归纳</h3>

                {
                    !!result.length
                        ? (
                            <Accordion
                                className="[&>hr]:bg-[#eee] !px-0 [&>hr]:dark:bg-[#4e5969] [&>hr]:transition-colors"
                                motionProps={{
                                    variants: {
                                        enter: {
                                            y: 0,
                                            opacity: 1,
                                            height: "auto",
                                            transition: {
                                                height: {
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 30,
                                                    duration: 1,
                                                },
                                                opacity: {
                                                    ease: "easeInOut",
                                                    duration: 1,
                                                },
                                            },
                                        },
                                        exit: {
                                            y: -10,
                                            opacity: 0,
                                            height: 0,
                                            transition: {
                                                height: {
                                                    ease: "easeInOut",
                                                    duration: 0.25,
                                                },
                                                opacity: {
                                                    ease: "easeInOut",
                                                    duration: 0.3,
                                                },
                                            },
                                        },
                                    },
                                }}
                            >
                                {
                                    result.map((item, index) => (
                                        <AccordionItem key={index} aria-label={item.year + '年'} title={<Title data={item} />}>
                                            {
                                                Object.keys(item.month).map((month, index) => (
                                                    <div key={index} className="ml-3">
                                                        <div className="relative border-l border-gray-300 dark:border-[#4e5969] transition-colors">
                                                            <div className="mb-8 ml-4">
                                                                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 border border-white"></div>
                                                                <div className="ml-2 sm:ml-6">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="text-2xl text-gray-600 dark:text-primary">{month}月 {((item.month[+month].wordCount / 1000) > 10) && '🔥'}</div>
                                                                        <div>{item.month[+month].total} 篇文章</div>
                                                                        <div>{(item.month[+month].wordCount / 1000).toFixed(2)} K字</div>
                                                                    </div>

                                                                    {
                                                                        item.month[+month].list.map((article: Article, index) => (
                                                                            <div key={index} className="group flex justify-between py-2">
                                                                                <Link href={`/article/${article.id}`} target="_blank" className="dark:text-[#bfbfbf] group-hover:text-primary transition-colors">{dayjs(+article.createTime!).format('MM-DD')} {article.title}</Link>
                                                                                <span className="hidden sm:flex items-center min-w-24 text-sm text-white group-hover:text-gray-400 transition-colors"><AiOutlineEye className="mr-1" />{article.view}</span>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </AccordionItem>
                                    ))
                                }
                            </Accordion>
                        )
                        : <div className="flex justify-center w-full my-10"><Spinner /></div>
                }
            </div>
        </>
    )
}