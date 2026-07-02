# 🎓 SDU 一键评教

山东大学教务系统一键评教工具。

---

## 📦 文件说明

```
├── pingjiao_auto.js      # 🔥 全自动评教脚本（推荐使用）
├── pingjiao_console.js   # 单门课快速评教脚本
├── run_pingjiao.py       # Python CLI 版
└── sdu_bkjws/            # Python 库（含查成绩、课表等更多功能）
```

---

## 🚀 使用方法

### 全自动版（推荐）

1. 浏览器登录教务系统，进入**评教课程列表页**
2. 按 **F12** → **Console**（控制台）
3. 复制 [`pingjiao_auto.js`](pingjiao_auto.js) 全部内容，粘贴进去，回车
4. 弹窗确认后等待自动完成

脚本会自动：
- ✅ 扫描所有未评课程
- ✅ 逐门勾选「很好(5)」
- ✅ 自动选课程难度 / 推荐评选
- ✅ 填写评语并提交
- ✅ 完成后自动刷新

### 单门课版

在评教表单页面，用 [`pingjiao_console.js`](pingjiao_console.js)。

### Python CLI 版

```bash
pip install requests beautifulsoup4
python run_pingjiao.py
```

### Python 库

```python
from sdu_bkjws import SduBkjws

sdu = SduBkjws('学号', '密码')

# 评教
result = sdu.comment_lesson()

# 自定义参数
result = sdu.comment_lesson(
    scores={52: 4.0, 54: 4.0},       # 少部分指标打 4 分
    comment_text='老师讲得很好！'
)

# 查课表
sdu.get_lesson()

# 查成绩
sdu.get_now_score()
sdu.get_past_score()
```

| Python 方法 | 功能 |
|------------|------|
| `comment_lesson()` | 一键评教 |
| `get_comment_lesson_info()` | 待评课程列表 |
| `get_lesson()` | 课表 |
| `get_now_score()` | 本学期成绩 |
| `get_past_score()` | 历年成绩 |
| `get_rank_with_query()` | 成绩排名 |
| `get_exam_time()` | 考试时间 |

---

## ⚠️ 使用限制与免责声明

### 使用限制

1. **仅供个人学习交流**：本工具仅为学习浏览器自动化、HTTP 请求逆向等技术的参考代码，不得用于商业目的或大规模批量操作。
2. **禁止滥用**：请勿用于刷评、恶意评价、干扰正常教学秩序等行为。
3. **评分真实性**：脚本默认填写高分仅为技术演示，使用者应**手动修改评分和评语**，如实反映对课程的真实评价。教学评估是学生的权利和义务，敷衍了事损害的是教学质量和你自己的利益。
4. **账号安全**：本脚本在浏览器 Console 中运行，不会收集或上传学号和密码。请勿在不可信环境中运行第三方脚本。
5. **遵守校规**：使用前请确认不违反山东大学关于教务系统使用的相关规定。

### 免责声明

- 本工具按"**原样**"提供，不提供任何明示或暗示的保证。
- 使用者自行承担使用本工具所产生的一切后果，包括但不限于评教失败、账号异常、违反校规校纪等。
- 作者不鼓励任何形式的虚假评教。**建议自动填写后手动逐项核对并修改评分。**

---

## 🙏 致谢

- [Trim21/sdu_bkjws](https://github.com/Trim21/sdu_bkjws) — 教务系统 Python 库
- [fiht/SDU_Pingjiao](https://github.com/fiht/SDU_Pingjiao) — 评教脚本原始实现

---

## 📄 License

[GPLv3](LICENSE)
