$(window).on('load', () => {
    $("#preloader").fadeOut("slow");

    let pageWidth, pageHeight;

    let basePage = {
        width: 1280,
        height: 960,
        scale: 1,
        scaleX: 1,
        scaleY: 1
    };

    let $page = $('.page_content');
    getPageSize();
    scalePages($page, pageWidth, pageHeight);

    //using underscore to delay resize method till finished resizing window
    $(window).resize(_.debounce(() => {
        getPageSize();
        scalePages($page, pageWidth, pageHeight);
    }, 150));


    function getPageSize() {
        pageHeight = $('#container').height();
        pageWidth = $('#container').width();
    }

    function scalePages(page, maxWidth, maxHeight) {
        let scaleX = 1, scaleY = 1;
        scaleX = maxWidth / basePage.width;
        scaleY = maxHeight / basePage.height;
        basePage.scaleX = scaleX;
        basePage.scaleY = scaleY;
        basePage.scale = (scaleX > scaleY) ? scaleY : scaleX;

        let newLeftPos = Math.abs(Math.floor(((basePage.width * basePage.scale) - maxWidth) / 2));

        page.attr('style', '-webkit-transform:scale(' + basePage.scale + ');left:' + newLeftPos + 'px;top:0px');
    }

    $(".option").click(function () {
        if (!$(".option").hasClass("disabled")) {
            $(this).toggleClass('selected').siblings().removeClass("selected");
        }

    });

    $(".answer").click((e) => {
        let selectedAnswer = e.target;
        if (!selectedAnswer.classList.contains("filled")) {
            let audioTage = document.getElementById("audioPlayer1");
            let selectedOption = $(".selected");
            if (selectedOption.length > 0) {
                if (selectedOption[0].dataset.answer === "correct") {
                    selectedOption.css("visibility", "hidden");
                    selectedOption.removeClass("selected");
                    selectedAnswer.classList.add("filled")
                    selectedAnswer.append(selectedOption[0].innerHTML);
                    selectedAnswer.innerHTML += "<div class='showAnswerTickMark showAns'><img src='assets/images/tikMark-small.png'></div>";
                    audioTage.src = "assets/audio/correct.mp3"
                    audioTage.play();
                } else {
                    selectedAnswer.append(selectedOption[0].innerHTML);
                    selectedAnswer.innerHTML += "<div class='showAnswerTickMark showAns'><img style='width:40px' src='assets/images/crossMark.png'></div>";
                    audioTage.src = "assets/audio/incorrect.mp3"
                    audioTage.play();

                    setTimeout(() => {
                        selectedAnswer.innerHTML = "";
                    }, 1000);
                }
            }
        }
    });

    $(".reloadBtnAll").click(() => {
        $(".option").css("visibility", "visible").removeClass("selected").removeClass("disabled");
        $(".showAnsBtn").removeClass("disabled");
        $(".answer").removeClass("filled").empty();
    });

    $(".showAnsBtn").click(() => {
        if (!$(".showAnsBtn").hasClass("disabled")) {
            $(".showAnsBtn").addClass("disabled");
            let options = $(".option");
            let answers = $(".answer");
            options.addClass("disabled").removeClass("selected");
            answers.empty();
            let correctAnswers = []

            options.each((i, option) => {
                if (option.dataset.answer === "correct") {
                    option.style.visibility = "hidden";
                    correctAnswers.push(option.innerHTML + "<div class='showAnswerTickMark showAns'><img src='assets/images/tikMark-small.png'></div>");
                }

            });

            answers.each((i, answer) => {
                answer.innerHTML = correctAnswers[i];
                answer.classList.add("filled");

            });
        }
    });

});