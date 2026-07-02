/**
 * 山东大学威海校区 - 智慧教学服务平台 - 一键评教脚本
 *
 * 使用方法：
 * 1. 在浏览器打开评教页面 https://bkzhjx.wh.sdu.edu.cn/jsxsd/
 * 2. 进入需要评教的课程页面
 * 3. 按 F12 打开开发者工具，切换到 Console（控制台）
 * 4. 粘贴下面整个脚本，按回车运行
 * 5. 脚本会自动勾选所有"很好(5)"、填写评语、提交
 *
 * 每门课需要运行一次。
 */

(function() {
    'use strict';

    console.log('🚀 一键评教脚本启动...');

    // ========== 1. 自动勾选所有"很好(5)" ==========
    var totalIndicators = 0;
    document.querySelectorAll('input[type="radio"]').forEach(function(radio) {
        var label = radio.parentElement;
        if (label && label.textContent.includes('很好')) {
            radio.checked = true;
            totalIndicators++;
        }
    });
    console.log('✅ 已勾选 ' + totalIndicators + ' 个"很好(5)"选项');

    // ========== 2. 课程难度 ==========
    var difficultyRadios = document.getElementsByName('kctzdnd');
    if (difficultyRadios.length >= 3) {
        difficultyRadios[2].checked = true;  // "课程难度适中"
        console.log('✅ 课程难度: 难度适中');
    }

    // ========== 3. 是否推荐 ==========
    var recommendRadios = document.getElementsByName('yxjspx');
    if (recommendRadios.length > 0) {
        recommendRadios[0].checked = true;  // "推荐"
        console.log('✅ 推荐评选: 推荐');
    }

    // ========== 4. 填写评语 ==========
    var commentBox = document.querySelector('textarea[name="jynr"]');
    var comments = [
        '老师教学认真负责，课程内容丰富，收获很大。',
        '课堂氛围活跃，老师讲解清晰，学到了很多知识。',
        '课程设计合理，老师备课充分，学习体验很好。',
        '老师授课生动有趣，注重学生能力培养，受益匪浅。'
    ];
    if (commentBox) {
        commentBox.value = comments[Math.floor(Math.random() * comments.length)];
        console.log('✅ 已填写评语');
    }

    // ========== 5. 绕过 debugger 陷阱，自动提交 ==========
    var submitBtn = document.getElementById('tj');
    if (submitBtn) {
        // 验证所有指标都已选择
        var pj06xhs = document.getElementsByName('pj06xh');
        var allChecked = true;
        for (var i = 0; i < pj06xhs.length; i++) {
            var checked = document.querySelector('input[name="pj0601id_' + pj06xhs[i].value + '"]:checked');
            if (!checked) {
                console.warn('⚠️ 指标 ' + pj06xhs[i].value + ' 未选择');
                allChecked = false;
            }
        }

        if (allChecked) {
            // 直接提交表单，绕过带 debugger 的 saveData 函数
            document.getElementById('issubmit').value = '1';
            document.getElementById('Form1').submit();
            console.log('🎉 评教已提交！');
        } else {
            console.error('❌ 部分指标未勾选，请手动检查');
        }
    } else {
        console.log('💡 请手动点击"提交"按钮（已自动填好所有选项）');
    }
})();
