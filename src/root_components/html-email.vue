<template>
    <!--用于邮件的HTML，注意要以table、tr、td的顺序编写DOM，否则在邮箱里无法显示背景
    邮件不能使用HTML5语法，要用老的HTML语法，这里为表格布局——Table布局
    为了能在PHP中的字符串里嵌入变量，这里会将双引号——'一键替换成单引号——'-->
    <table border='0'>
        <tr>
            <td class='p-80 mpy-35 mpx-15' bgcolor='#212429' style='padding: 50px'>
                <table width='100%' border='0' cellspacing='0' cellpadding='0'>
                    <tbody>
                        <tr>
                            <td
                                class='img pb-45'
                                style='font-size: 0; line-height: 0; text-align: left; padding-bottom: 40px'
                            >
                                <a
                                    href='https://www.hyy666.top/'
                                    target='_blank'
                                    rel='noopener'
                                    style='text-decoration: none'
                                >
                                    <h1 style='font-size: 40px; text-align: center; color: white'>待办事项</h1>
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <table width='100%' border='0' cellspacing='0' cellpadding='0'>
                                    <tbody>
                                        <tr>
                                            <td
                                                class='title-36 pb-30 c-grey6 fw-b'
                                                style='
                                                    font-size: 36px;
                                                    line-height: 42px;
                                                    font-family: Arial, sans-serif, Motiva Sans;
                                                    text-align: left;
                                                    padding-bottom: 30px;
                                                    color: #bfbfbf;
                                                    font-weight: bold;
                                                '
                                            >
                                                <a
                                                    href='mailto:2690085099@qq.com'
                                                    rel='noopener'
                                                    target='_blank'
                                                    style='text-decoration: none; color: #bfbfbf'
                                                    >2690085099@qq.com</a
                                                >，您好！
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table width='100%' border='0' cellspacing='0' cellpadding='0'>
                                    <tbody>
                                        <tr>
                                            <td
                                                class='text-18 c-grey4 pb-30'
                                                style='
                                                    font-size: 18px;
                                                    line-height: 25px;
                                                    font-family: Arial, sans-serif, Motiva Sans;
                                                    text-align: left;
                                                    color: #dbdbdb;
                                                    padding-bottom: 30px;
                                                '
                                            >
                                                您登录帐户 2690085099@qq.com 所需的 蒸汽平台令牌验证码 为：
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table width='100%' border='0' cellspacing='0' cellpadding='0'>
                                    <tbody>
                                        <tr>
                                            <td class='pb-70 mpb-50' style='padding-bottom: 70px'>
                                                <table
                                                    width='100%'
                                                    border='0'
                                                    cellspacing='0'
                                                    cellpadding='0'
                                                    bgcolor='#17191c'
                                                >
                                                    <tbody>
                                                        <tr>
                                                            <td class='py-30 px-56' style='padding: 30px 56px'>
                                                                <table
                                                                    width='100%'
                                                                    border='0'
                                                                    cellspacing='0'
                                                                    cellpadding='0'
                                                                >
                                                                    <tbody>
                                                                        <tr>
                                                                            <td
                                                                                class='title-48 c-blue1 fw-b a-center'
                                                                                style='
                                                                                    font-size: 48px;
                                                                                    line-height: 52px;
                                                                                    font-family: Arial, sans-serif,
                                                                                        Motiva Sans;
                                                                                    color: #3a9aed;
                                                                                    font-weight: bold;
                                                                                    text-align: center;
                                                                                '
                                                                            >
                                                                                3Y2CH
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table width='100%' border='0' cellspacing='0' cellpadding='0'>
                                    <tbody>
                                        <tr>
                                            <td
                                                class='text-18 c-grey4 pb-30'
                                                style='
                                                    font-size: 18px;
                                                    line-height: 25px;
                                                    font-family: Arial, sans-serif, Motiva Sans;
                                                    text-align: left;
                                                    color: #dbdbdb;
                                                    padding-bottom: 30px;
                                                '
                                            >
                                                您会收到这封自动产生的邮件，是由于有人在<a
                                                    style='color: #c6d4df'
                                                    href='https://my.steamchina.com/actions/ReportSuspiciousLogin?l=schinese&amp;stoken=e37d8d483e5e7f26792578f3e351716ef503476c06e072dc237d8badc0f88c89da70c01cd83f39b00d44b060127ce79998492abd3e01049357f0ccb3fbef8b225cd250ddb3152bcf67eb5f10dc847d637f1bb39d727937efb9849d4dfabfc3db'
                                                    rel='noopener'
                                                    target='_blank'
                                                    >113.64.181.193（CN）</a
                                                >试图通过网页或移动设备登录您的帐户，且提供了正确的帐户名称与密码。<br /><br />
                                                蒸汽平台令牌验证码是完成登录所必需的。<span
                                                    style='color: #ffffff; font-weight: bold'
                                                    >没有人能够不访问这封电子邮件就访问您的帐户。</span
                                                ><br /><br />
                                                <span style='color: #ffffff; font-weight: bold'>如果您未曾尝试登录</span
                                                >，那么请更改您的 蒸汽平台
                                                密码，并考虑更改您的电子邮件密码，以确保您的帐户安全。
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table width='100%' border='0' cellspacing='0' cellpadding='0'>
                                    <tbody>
                                        <tr>
                                            <td
                                                class='text-18 c-blue1 pb-40'
                                                style='
                                                    font-size: 18px;
                                                    line-height: 25px;
                                                    font-family: Arial, sans-serif, Motiva Sans;
                                                    text-align: left;
                                                    color: #7abefa;
                                                    padding-bottom: 40px;
                                                '
                                            ></td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table width='100%' border='0' cellspacing='0' cellpadding='0'>
                                    <tbody>
                                        <tr>
                                            <td class='pt-30' style='padding-top: 30px'>
                                                <table width='100%' border='0' cellspacing='0' cellpadding='0'>
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                class='img'
                                                                width='3'
                                                                bgcolor='#3a9aed'
                                                                style='font-size: 0; line-height: 0; text-align: left'
                                                            ></td>
                                                            <td
                                                                class='img'
                                                                width='37'
                                                                style='font-size: 0; line-height: 0; text-align: left'
                                                            ></td>
                                                            <td>
                                                                <table
                                                                    width='100%'
                                                                    border='0'
                                                                    cellspacing='0'
                                                                    cellpadding='0'
                                                                >
                                                                    <tbody>
                                                                        <tr>
                                                                            <td
                                                                                class='text-16 py-20 c-grey4 fallback-font'
                                                                                style='
                                                                                    font-size: 16px;
                                                                                    line-height: 22px;
                                                                                    font-family: Arial, sans-serif,
                                                                                        Motiva Sans;
                                                                                    text-align: left;
                                                                                    padding-top: 20px;
                                                                                    padding-bottom: 20px;
                                                                                    color: #f1f1f1;
                                                                                '
                                                                            >
                                                                                祝您愉快，<br />
                                                                                蒸汽平台团队
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </table>
</template>

<script>
export default {
    name: 'html-email',
};
</script>

<style scoped></style>