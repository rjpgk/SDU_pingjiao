#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""一键评教脚本"""
from getpass import getpass
from sdu_bkjws import SduBkjws

print('=' * 40)
print('  山东大学本科教务系统 - 一键评教')
print('=' * 40)

user_id = input('请输入学号: ')
password = input('请输入密码: ')

print('\n正在登录...')
try:
    sdu = SduBkjws(user_id, password)
except Exception as e:
    print(f'❌ 登录失败: {e}')
    exit(1)

print('登录成功！正在获取需要评教的课程...\n')

# 先看看有哪些课要评
courses = sdu.get_comment_lesson_info()
unevaluated = [c for c in courses if c.get('pgcs', 1) == 0]

if not unevaluated:
    print('没有需要评教的课程，可能都已经评过了。')
    exit(0)

print(f'共 {len(unevaluated)} 门课程需要评教：')
for c in unevaluated:
    print(f'  📖 {c["kcm"]} - {c["jsm"]}')

print('\n开始评教（全部默认 5 分 + 随机评语）...\n')

result = sdu.comment_lesson()

ok = 0
fail = 0
for r in result:
    if r['success']:
        print(f'  ✅ {r["kcm"]} - {r["jsm"]}')
        ok += 1
    else:
        print(f'  ❌ {r["kcm"]} - {r["jsm"]}: {r.get("error", "未知错误")}')
        fail += 1

print(f'\n完成！成功 {ok} 门，失败 {fail} 门')
