// 宝可梦中文→英文名称映射表
// 基于官方中文译名，用于支持中文搜索

export const CN_TO_EN: Record<string, string> = {
  // === 初代 ===
  妙蛙种子: "Bulbasaur",
  妙蛙草: "Ivysaur",
  妙蛙花: "Venusaur",
  小火龙: "Charmander",
  火恐龙: "Charmeleon",
  喷火龙: "Charizard",
  杰尼龟: "Squirtle",
  卡咪龟: "Wartortle",
  水箭龟: "Blastoise",
  皮卡丘: "Pikachu",
  雷丘: "Raichu",
  伊布: "Eevee",
  水伊布: "Vaporeon",
  雷伊布: "Jolteon",
  火伊布: "Flareon",
  梦幻: "Mew",
  超梦: "Mewtwo",
  卡比兽: "Snorlax",
  快龙: "Dragonite",
  耿鬼: "Gengar",
  胡地: "Alakazam",
  怪力: "Machamp",

  // === 传说 & 热门 ===
  洛奇亚: "Lugia",
  凤王: "Ho-Oh",
  时拉比: "Celebi",
  盖欧卡: "Kyogre",
  固拉多: "Groudon",
  烈空坐: "Rayquaza",
  帝牙卢卡: "Dialga",
  帕路奇亚: "Palkia",
  骑拉帝纳: "Giratina",
  阿尔宙斯: "Arceus",
  莱希拉姆: "Reshiram",
  捷克罗姆: "Zekrom",
  酋雷姆: "Kyurem",
  苍响: "Zacian",
  藏玛然特: "Zamazenta",
  无极汰那: "Eternatus",

  // === PTCG 环境热门 ===
  连击熊: "Rapid Strike Urshifu",
  一击熊: "Single Strike Urshifu",
  黑马蕾冠王: "Shadow Rider Calyrex",
  白马蕾冠王: "Ice Rider Calyrex",
  月亮伊布: "Umbreon",
  太阳伊布: "Espeon",
  冰伊布: "Glaceon",
  叶伊布: "Leafeon",
  仙子伊布: "Sylveon",
  沙奈朵: "Gardevoir",
  幸福蛋: "Blissey",
  冰砌鹅: "Eiscue",
  多龙巴鲁托: "Dragapult",
  戽斗尖梭: "Barraskewda",
  古剑豹: "Chien-Pao",
  古鼎鹿: "Ting-Lu",
  古玉鱼: "Chi-Yu",
  古简蜗: "Wo-Chien",
  密勒顿: "Miraidon",
  故勒顿: "Koraidon",
  轰鸣月: "Roaring Moon",
  铁武者: "Iron Valiant",
  铁臂膀: "Iron Hands",
  铁脖颈: "Iron Jugulis",
  铁荆棘: "Iron Thorns",
  铁包袱: "Iron Bundle",
  铁毒蛾: "Iron Moth",
  振翼发: "Flutter Mane",
  吼叫尾: "Scream Tail",
  猛恶菇: "Brute Bonnet",
  沙铁皮: "Sandy Shocks",
  爬地翅: "Slither Wing",
  雄伟牙: "Great Tusk",

  // === 训练家卡 ===
  "博士的研究": "Professor's Research",
  玛俐: "Marnie",
  老大的指令: "Boss's Orders",
  高级球: "Ultra Ball",
  宝可梦交替: "Switch",
  回收网: "Scoop Up Net",
  讲究头带: "Choice Belt",
  熔接工: "Welder",
  朋友手册: "Pal Pad",
  普通钓竿: "Ordinary Rod",
  神奇糖果: "Rare Candy",
  先机球: "Quick Ball",
  巢穴球: "Nest Ball",
  熏香: "Incense",
  离洞绳: "Escape Rope",
};

// 反向查找：英文→中文（用于搜索时翻译）
export function translateQuery(query: string): string {
  const trimmed = query.trim();

  // 直接匹配
  if (CN_TO_EN[trimmed]) {
    return CN_TO_EN[trimmed];
  }

  // 模糊匹配：查找包含关键词的翻译
  for (const [cn, en] of Object.entries(CN_TO_EN)) {
    if (trimmed.includes(cn) || cn.includes(trimmed)) {
      return en;
    }
  }

  // 没找到翻译，原样返回（可能是英文或拼音）
  return trimmed;
}
