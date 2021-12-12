window.addEventListener('load', () => {
    let state = null;
    let slogan = [["生命不再只有一次，孩子将会是你的来世", "You don't only have one life anymore. Your children will be your afterlife."],
                  ["一次怀胎一次幸福，一次抚育一次美满", "A pregnancy a happiness, an upbringing a happy."],
                  ["给孩子一个生存的权利", "Give your child the right to live."],
                  ["多个孩子，多份希望", "One more child, one more hope."],
                  ["生育能兴邦，不生则亡国", "Birth makes a nation flourish, not birth makes a nation perish."],
                  ["不要把孤独留给晚年", "Don't leave loneliness for old age."],
                  ["生老病死，好孕好福","Birth and death, good pregnancy and good fortune."],
                  ["下一个伟人的诞生。可能就是你们的杰作","The birth of the next great man. It could be your work."],
                  ["你现在年轻不生孩子，等你老了想生的时候就后悔去吧","You're young now. If you don't have kids, you'll regret it when you're old and want to."],
                  ["生自己的孩子，让别人去羡慕吧！","Have your own children, let others evny you!"]
                ];
    //listen for click events 监听点击事件 
    document.getElementById('done').addEventListener('click', () => {
        let noThings = document.getElementById('task-task').value;
        if(noThings === ""){
            alert("can not be empty!");
            return;
        }
        //creating the object 
        let obj = { "tasktask": noThings };
        //state 判断点击Done是新增还是修改 如果为null是新增
        if (state === null) {
            //fetch to route noTasks
            fetch('/noThings', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then(response => {
                    //删除div里面的所有circle，再把input置空
                    let circles = document.getElementById('circles');
                    var pObjs = circles.childNodes;
                    for (var i = pObjs.length - 1; i >= 0; i--) {
                        circles.removeChild(pObjs[i]);
                    }
                    document.getElementById('task-task').value = '';
                    alert("ok!")
                })
        } else {
            //modify （然后设置了state，再次点击done的时候会判断state是否为null。如果不为null，则表示之前点击了小圆点，是修改，则发送请求，修改对应的内容。）
            obj._id = state;
            fetch('/update', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(obj)
            }).then(res => {
                let circles = document.getElementById('circles');
                var pObjs = circles.childNodes;
                for (var i = pObjs.length - 1; i >= 0; i--) {
                    circles.removeChild(pObjs[i]);
                }
                state = null;
                document.getElementById('task-task').value = '';
                alert("ok!")
            }).catch(err=>{
                alert("err")
            })
        }

    })
    //change title 轮播
    document.getElementById("button-change").addEventListener("click",()=>{
        let index = parseInt(Math.random()*10); //随机下标 
        document.getElementById("text-en").innerHTML = slogan[index][0];
        document.getElementById("text-ch").innerHTML = slogan[index][1];
    })
    document.getElementById('get-tracker').addEventListener('click', () => {
        let total = 0;
        let dateab = document.getElementById('date').value;
        let circles = document.getElementById('circles');
        var pObjs = circles.childNodes;
        for (var i = pObjs.length - 1; i >= 0; i--) {
            circles.removeChild(pObjs[i]);
        }
        //get info on ALL the tasks we've had so far
        fetch('/getThings')
            .then(response => response.json())
            .then(data => {
                document.getElementById('task-task').value = '';
                let info = "";
                for (let i = 0; i < data.data.length; i++) {
                    let obj = data.data[i];
                    let string = data.data[i].task + " -- " + data.data[i].datea;
                    let dateaa = data.data[i].datea;
                    if (dateaa == dateab) {
                        total += 1;
                        info += string + "\n";
                        //添加当前选择日期的circle（既添加点击事件，把input里面的内容变成了对应小圆点的内容，回到40-58行）
                        let cir = document.createElement("div");
                        cir.className = "circle";
                        cir.setAttribute("data-id", obj._id);
                        cir.addEventListener("click", function () {
                            //给circl添加点击事件 如果点击后则给state负值为对应_id
                            document.getElementById('task-task').value = data.data[i].task;
                            state = obj._id;
                        })
                        circles.appendChild(cir);
                    }
                }
                document.getElementById('task-task').value = info;
            })
    })
})