<template>
    <div id="web-footer">
        <footer id="beiAnFooter">
            <a class="beiAnText" href="https://user.qzone.qq.com/2690085099" target="_blank">
                © 2022 黄元昱
                <span class="segmentation">|</span>
            </a>
            <a class="beiAnText" href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2022064736号</a>
        </footer>
    </div>
</template>

<script>
export default {
    name: "web-footer",
};
</script>

<style scoped>
/*网站备案的Footer——类似于Div*/
#beiAnFooter {
    width: 100%;
    position: absolute;
    bottom: 1vh;
    text-align: center;
}

/*网站备案*/
.beiAnText {
    font-size: 1vh;
    color: rgba(255, 255, 255, 0.4);
    text-decoration: none;
    transition: all 0.4s ease-in-out;
}

.beiAnText:hover {
    color: rgba(255, 255, 255, 0.6);
    cursor: url("../../assets/cursor/pointer.png"), pointer;
}

.beiAnText::selection {
    color: #004da3;
    background: white;
}

/*分割线*/
.segmentation {
    color: rgba(255, 255, 255, 0.2);
    margin-left: 0.6vw;
    margin-right: 0.6vw;
}
</style>