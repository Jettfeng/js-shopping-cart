window.onload = function () {
    // 处理IE不支持getElementsByClassName的情况
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (cls) {
            var ret = [];
            // 获取所有标签
            var els = document.getElementsByTagName('*');
            for (var i = 0, len = els.length; i < len; i++) {
                // 该标签可能有多个类名
                if (els[i].className === cls
                    || els[i].className.indexOf(cls + ' ') >= 0
                    || els[i].className.indexOf(' ' + cls + ' ') >= 0
                    || els[i].className.indexOf(' ' + cls) >= 0) {
                    ret.push(els[i]);
                }
            }
            return ret;
        }
    }
    // 获取表格
    var cartTable = document.getElementById('cartTable');
    // 获取tbody所有的tr .rows表格特有的属性，
    var tr = cartTable.children[1].rows;
    // 获取所有的选中框
    var checkInputs = document.getElementsByClassName('check');
    // 全选框
    var checkAllInputs = document.getElementsByClassName('check-all');
    // 选中的所有商品
    var selectedTotal = document.getElementById('selectedTotal');
    // 总价
    var priceTotal = document.getElementById('priceTotal');

    var selected = document.getElementById('selected');
    var foot = document.getElementById('foot');
    var selectedViewList = document.getElementById('selectedViewList');
    var deleteAll = document.getElementById('deleteAll');

    //计算总数和总价
    function getTotal() {
        // 总数
        var seleted = 0;
        // 总价
        var price = 0;
        var HTMLstr = '';
        for (var i = 0, len = tr.length; i < len; i++) {
            if (tr[i].getElementsByTagName('input')[0].checked) {
                tr[i].className = 'on';
                seleted += parseInt(tr[i].getElementsByTagName('input')[1].value);
                price += parseFloat(tr[i].cells[4].innerHTML);
                HTMLstr += '<div><img src="' + tr[i].getElementsByTagName('img')[0].src + '"><span class="del" index="' + i + '">取消选择</span></div>'
            }
            else {
                tr[i].className = '';
            }
        }

        selectedTotal.innerHTML = seleted;
        priceTotal.innerHTML = price.toFixed(2);
        selectedViewList.innerHTML = HTMLstr;

        if (seleted == 0) {
            foot.className = 'foot';
        }
    }

    //小计（计算每行）
    function getSubTotal(tr) {
        var tds = tr.cells;
        var price = parseFloat(tds[2].innerHTML);
        var count = parseInt(tr.getElementsByTagName('input')[1].value);
        var SubTotal = parseFloat(price * count);
        tds[4].innerHTML = SubTotal.toFixed(2);
    }

    for (var i = 0 , len = checkInputs.length; i < len; i++) {
        checkInputs[i].onclick = function () {
            // 全选
            if (this.className === 'check-all check') {
                for (var j = 0; j < checkInputs.length; j++) {
                    // 如果当前全选框为true，所有的选择框都为tru，反之亦然
                    checkInputs[j].checked = this.checked;
                }
            }
            if (this.checked == false) {
                // 如果有一个为false，所有的全选框都为false
                for (var k = 0; k < checkAllInputs.length; k++) {
                    checkAllInputs[k].checked = false;
                }
            }
            getTotal();
        }
    }
    // 点击商品，显示或隐藏弹出层
    selected.onclick = function () {
        if (foot.className == 'foot') {
            if (selectedTotal.innerHTML != 0) {
                foot.className = 'foot show';
            }
        }
        else {
            foot.className = 'foot';
        }
    }
    // 事件代理
    selectedViewList.onclick = function (e) {
        console.log(e)
        // ie低版本没有e
        e = e || window.event;
        var el = e.srcElement;
        if (el.className == 'del') {
            var index = el.getAttribute('index');
            var input = tr[index].getElementsByTagName('input')[0];
            input.checked = false;
            input.onclick();
        }
    }
    // 商品加减
    for (var i = 0; i < tr.length; i++) {
        tr[i].onclick = function (e) {
            e = e || window.event;
            var el = e.srcElement;
            var cls = el.className;
            var input = this.getElementsByTagName('input')[1];
            var val = parseInt(input.value);
            var reduce = this.getElementsByTagName('span')[1];
            switch (cls) {
                case 'add':
                    input.value = val + 1;
                    reduce.innerHTML = '-';
                    getSubTotal(this);
                    break;
                case 'reduce':
                    if (val > 1) {
                        input.value = val - 1;
                    }
                    if (input.value <= 1) {
                        reduce.innerHTML = '';
                    }
                    getSubTotal(this);
                    break;
                    // 删除商品
                case 'delete':
                    var conf = confirm('确定要删除吗？');
                    if (conf) {
                        // 删除当前的this
                        this.parentNode.removeChild(this);
                    }
                    break
                default :
                    break;
            }
            getTotal();
        }
        // 键盘输入数组
        tr[i].getElementsByTagName('input')[1].onkeyup = function () {
            var val = parseInt(this.value);
            var tr = this.parentNode.parentNode
            var reduce = tr.getElementsByTagName('span')[1];
            if (isNaN(val) || val < 1) {
                val = 1;
            }
            this.value = val;
            if (val <= 1) {
                reduce.innerHTML = '';
            }
            else {
                reduce.innerHTML = '-';
            }
            getSubTotal(tr);
            getTotal();
        }
    }
    // 删除商品（可多选删除）
    deleteAll.onclick = function () {
        if (selectedTotal.innerHTML != '0') {
            var conf = confirm('确定删除吗？');
            if (conf) {
                for (var i = 0; i < tr.length; i++) {
                    var input = tr[i].getElementsByTagName('input')[0];
                    if (input.checked) {
                        tr[i].parentNode.removeChild(tr[i]);
                        i--;
                    }
                }
            }
        }
    }
    // 全选默认为选中状态
    checkAllInputs[0].checked = true;
    // 执行全选点击事件。选中所有商品
    checkAllInputs[0].onclick();
}
