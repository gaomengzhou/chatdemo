type Universal = string | number;
interface ENV {
  // 打包文件夹名
  BUILD_PATH?: Universal;
  // BASE URL
  REACT_APP_API_URL?: Universal;
  // 应用名称
  REACT_APP_NAME?: Universal;
  // 应用关键字
  REACT_APP_META_KEYWORDS?: Universal;
  // 应用描述
  REACT_APP_META_DESCRIPTION?: Universal;
  // 应用平台标识
  REACT_APP_PLATFORM_ID?: Universal;
  // test
  REACT_APP_TEST?: Universal;
}
export default ENV;
