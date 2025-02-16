import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 导出一个函数，用于合并传入的ClassValue类型的参数
export function cn(...inputs: ClassValue[]) {
    // 使用twMerge函数合并传入的参数
    return twMerge(clsx(inputs));
} 
