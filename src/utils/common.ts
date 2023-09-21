/**
 * @description:
 * @param {string} name 静态资源名 xxx.png
 * @param {string} base 路径 eg: /src/assets/images/
 * @return {*}
 */
export const getStaticResourceUrl = (name: string, base: string) => {
    const isProduction = import.meta.env.MODE === 'production';
    let baseUrl = base;
    if (isProduction) {
        baseUrl = base.replace('/src/assets', '.');
    }
    return new URL(`${baseUrl}${name}`, import.meta.url).href;
};
