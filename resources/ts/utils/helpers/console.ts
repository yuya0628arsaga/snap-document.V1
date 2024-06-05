import { textColor } from "../themeClient"

/**
 * 処理成功のconsole
 * @param message
 * @param result
 * @param color
 */
export const successConsole = (
    message: string,
    result: any = null,
    color: string = 'green'
) => {
    console.log(`%c${message}: `, `color: ${color};`, result)
}

/**
 * 処理失敗のconsole
 * @param message
 * @param result
 * @param color
 */
export const errorConsole = (
    message: string,
    result: any = null,
    color: string = `${textColor.error}`
) => {
    console.log(`%c${message}: `, `color: ${color};`, result)
}