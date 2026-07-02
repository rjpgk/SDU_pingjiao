# 🎓 SDU 一键评教 / 教务系统工具集

山东大学教务系统相关工具集合，包含**评教自动化脚本**和**教务系统 Python 库**。

> **适用校区**：济南本部（旧教务系统）+ 威海校区（智慧教学服务平台）

---

## 📦 项目结构

```
├── pingjiao_auto.js      # 🔥 全自动评教脚本（推荐）
├── pingjiao_console.js   # 单门课评教脚本
├── sdu_bkjws/            # 旧教务系统 Python 库（济南本部用）
│   └── __init__.py
├── run_pingjiao.py       # Python 版一键评教（旧系统用）
└── docs/                 # 旧系统文档
```

---

## 🚀 快速开始（威海校区同学用这个）

> 适配 **强智科技教务系统** `bkzhjx.wh.sdu.edu.cn`

### 全自动评教（一键搞定所有课程）

1. 浏览器打开评教课程列表页面
2. 按 **F12** → 切换到 **Console**（控制台）
3. 复制 [`pingjiao_auto.js`](pingjiao_auto.js) 全部内容，粘贴到 Console 中
4. 按回车，确认弹窗

脚本会自动：
- ✅ 扫描所有未评课程
- ✅ 逐门勾选「很好(5)」全部指标
- ✅ 自动选"课程难度适中" / "推荐评选"
- ✅ 随机填写正面评语
- ✅ 提交后自动处理下一门
- ✅ 完成后自动刷新页面

### 单门课评教

如果只想评一门课，在评教表单页面用 [`pingjiao_console.js`](pingjiao_console.js)。

---

## 🐍 Python 库（济南本部旧系统）

> 适配旧教务系统 `bkjws.sdu.edu.cn`（已停用/仅限济南校区内网）

### 安装

```bash
pip install requests beautifulsoup4
```

### 使用示例

```python
from sdu_bkjws import SduBkjws

sdu = SduBkjws('学号', '密码')

# 查课表
print(sdu.get_lesson())

# 查成绩
print(sdu.get_now_score())      # 本学期
print(sdu.get_past_score())     # 历年

# 查需要评教的课程
print(sdu.get_comment_lesson_info())

# 一键评教
result = sdu.comment_lesson()
for r in result:
    print(f"{'✅' if r['success'] else '❌'} {r['kcm']} - {r['jsm']}")

# 自定义评教参数
result = sdu.comment_lesson(
    xnxq='2025-2026-2',                  # 学年学期
    scores={52: 4.0, 54: 4.0},           # 部分指标调分
    comment_text='老师讲得很好！'          # 自定义评语
)
```

### Python 库功能

| 方法 | 功能 |
|------|------|
| `get_lesson()` | 获取课表 |
| `get_now_score()` | 本学期成绩 |
| `get_past_score()` | 历年成绩 |
| `get_fail_score()` | 不及格成绩 |
| `get_rank_with_query()` | 单科排名 |
| `get_exam_time(xnxq)` | 考试时间 |
| `get_detail()` | 学籍信息 |
| `get_comment_lesson_info()` | 待评课程列表 |
| `comment_lesson()` | 一键评教 |

---

## 📋 两个教务系统的区别

| | 旧系统 | 新系统 |
|---|---|---|
| 域名 | `bkjws.sdu.edu.cn` | `bkzhjx.wh.sdu.edu.cn` |
| 厂商 | 清华（？） | 湖南强智科技 |
| 校区 | 济南本部 | 威海校区 |
| 状态 | ❌ 外网已无法访问 | ✅ 运行中 |
| 工具 | Python 库 | Console JS 脚本 |

---

## ⚠️ 免责声明

本工具仅供学习交流使用。请合理使用，评教内容应真实反映课程质量。

---

## 📄 License

[GPLv3](LICENSE) — 原始项目采用 GPLv3，本工具继承相同协议。
