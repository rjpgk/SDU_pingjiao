/**
 * 山东大学威海校区 - 智慧教学服务平台 - 全自动一键评教
 *
 * 使用方法：
 * 1. 打开评教课程列表页：
 *    https://bkzhjx.wh.sdu.edu.cn/jsxsd/xspj/xspj_list.do?...
 * 2. 按 F12 → Console，粘贴本脚本，回车
 * 3. 脚本自动遍历所有"未评"课程，逐门评教，全程无需操作
 *
 * 注意：运行期间不要关闭页面。
 */

(async function() {
    'use strict';
    console.clear();
    console.log('%c🚀 全自动一键评教 v2.0', 'font-size:18px;font-weight:bold');
    console.log('%c══════════════════════════════════', 'color:#888');
    console.log('正在搜索评教课程列表（含内嵌 iframe）...\n');

    // =============================================
    // Step 0: 递归搜索所有 iframe，找到 #dataList
    // =============================================
    function findDataList(win) {
        // 尝试当前窗口
        const table = win.document.querySelector('#dataList');
        if (table) return { win: win, doc: win.document, table: table };

        // 递归搜索所有 iframe
        const iframes = win.document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                const iw = iframe.contentWindow;
                if (iw) {
                    const result = findDataList(iw);
                    if (result) return result;
                }
            } catch(e) { /* 跨域 iframe 跳过 */ }
        }
        return null;
    }

    const ctx = findDataList(window);
    if (!ctx) {
        console.error('❌ 找不到评教课程列表 (#dataList)！');
        console.log('请确保你在评教课程列表页面，然后重新运行脚本。');
        return;
    }
    console.log('✅ 已在 ' + (ctx.win === window ? '主窗口' : 'iframe') + ' 中找到课程列表\n');

    // =============================================
    // Step 1: 解析未评课程
    // =============================================
    const courses = [];
    const rows = ctx.doc.querySelectorAll('#dataList tr');

    rows.forEach(function(row) {
        const issaveEl = row.querySelector('input[name="issavestr"]');
        if (!issaveEl || issaveEl.value !== '否') return;

        const tds = row.querySelectorAll('td');
        if (tds.length < 5) return;

        const link = row.querySelector('a[href*="xspj_edit.do"]');
        if (!link) return;

        courses.push({
            name: (tds[3]?.textContent || '').trim(),
            teacher: (tds[4]?.textContent || '').trim(),
            editUrl: link.getAttribute('href')
        });
    });

    if (courses.length === 0) {
        console.log('✅ 所有课程已评完，无需操作！');
        if (confirm('没有未评课程，是否刷新页面？')) location.reload();
        return;
    }

    console.log(`📋 发现 %c${courses.length}%c 门未评课程：`, 'color:#f90;font-weight:bold', '');
    courses.forEach(function(c, i) {
        console.log(`   ${i + 1}. ${c.name} — ${c.teacher}`);
    });

    if (!confirm(`\n找到 ${courses.length} 门未评课程，确认开始自动评教吗？`)) {
        console.log('❌ 已取消');
        return;
    }

    console.log('\n%c开始自动评教...%c\n', 'font-size:14px;color:#0a0', '');

    // =============================================
    // Step 2: 逐门课程评教
    // =============================================
    let ok = 0, fail = 0;
    const baseUrl = 'https://bkzhjx.wh.sdu.edu.cn';

    const comments = [
        '老师教学认真负责，课程内容丰富，收获很大。',
        '课堂氛围活跃，老师讲解清晰，学到了很多知识。',
        '课程设计合理，老师备课充分，学习体验很好。',
        '老师授课生动有趣，注重学生能力培养，受益匪浅。'
    ];

    for (let i = 0; i < courses.length; i++) {
        const c = courses[i];
        const label = `[${i + 1}/${courses.length}] ${c.name}`;
        console.log(`${label} ...`);

        try {
            // --- 2a. 获取评教表单页面 ---
            const editUrl = c.editUrl.startsWith('http') ? c.editUrl : baseUrl + c.editUrl;
            const editResp = await fetch(editUrl, { credentials: 'include' });
            const html = await editResp.text();

            // --- 2b. 解析表单 ---
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const form = doc.getElementById('Form1');

            if (!form) {
                console.log(`  ⚠️ 找不到表单，可能已被评过，跳过`);
                fail++;
                continue;
            }

            const fd = new URLSearchParams();

            // 复制所有隐藏域
            form.querySelectorAll('input[type="hidden"]').forEach(function(inp) {
                fd.append(inp.name, inp.value);
            });

            // --- 2c. 每个指标选"很好(5)" ---
            const criteriaList = form.querySelectorAll('input[name="pj06xh"]');
            criteriaList.forEach(function(inp) {
                const n = inp.value;
                fd.append('pj06xh', n);

                const radioName = 'pj0601id_' + n;
                const radios = form.querySelectorAll('input[name="' + radioName + '"]');

                for (const r of radios) {
                    const label = r.closest('label');
                    if (label && label.textContent.includes('很好')) {
                        fd.append(radioName, r.value);
                        break;
                    }
                }
            });

            // --- 2d. 设置额外选项 ---
            fd.set('issubmit', '1');
            fd.set('kctzdnd', '3');    // 难度适中
            fd.set('yxjspx', '1');     // 推荐
            fd.set('jynr', comments[Math.floor(Math.random() * comments.length)]);

            // --- 2e. 提交 ---
            const saveResp = await fetch('/jsxsd/xspj/xspj_save.do', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: fd.toString()
            });

            const resultText = await saveResp.text();

            if (saveResp.ok && (resultText.includes('success') || resultText.includes('成功'))) {
                console.log(`  ✅ 评教成功`);
                ok++;
            } else {
                // 很多教务系统的save接口返回空或JSON，只要HTTP 200就视作成功
                if (saveResp.ok) {
                    console.log(`  ✅ 已提交 (HTTP ${saveResp.status})`);
                    ok++;
                } else {
                    console.warn(`  ⚠️ HTTP ${saveResp.status}: ${resultText.substring(0, 150)}`);
                    fail++;
                }
            }

        } catch (err) {
            console.error(`  ❌ 错误: ${err.message}`);
            fail++;
        }

        // 间隔 600ms，避免请求太快被限
        await new Promise(function(resolve) { setTimeout(resolve, 600); });
    }

    // =============================================
    // Step 3: 完成
    // =============================================
    console.log('\n%c══════════════════════════════════', 'color:#888');
    console.log(`%c🎉 全部完成！成功 ${ok} 门，失败 ${fail} 门`,
                'font-size:16px;font-weight:bold;color:#0a0');
    console.log('%c══════════════════════════════════', 'color:#888');
    console.log('\n页面将在 3 秒后自动刷新...');

    setTimeout(function() { location.reload(); }, 3000);

})();
