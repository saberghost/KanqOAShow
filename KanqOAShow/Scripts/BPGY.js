//$.fn.datagrid.defaults.loadMsg = "";

if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

//显示农转征项目
function showNzzxm(rowData) {
    $("#queryDiv #XMMC").html(rowData.XMMC);
    $("#queryDiv #PZDW").html(rowData.PZDW);
    $("#queryDiv #XMLX").html(rowData.XMLX);
    $("#queryDiv #PZWH").html(rowData.PZWH);
    $("#bppdZplDiv").css("display", "");
    loadBppdZpData(rowData.PZWH);
    $("#queryDiv #PZRQ").html(rowData.PZRQ);
    $("#queryDiv #ZMJ").html(rowData.ZMJ);
    linkBppdZp();
}

//显示城市用地情况
function showCsydqk(rowData) {
    if (rowData.XMLX != "3" && rowData.XMLX != "城市用地") {
        $("#queryDiv .formTable").eq(1).css("display", "none").next().css("display", "none");
    } else {
        $("#queryDiv .formTable").eq(1).css("display", "").next().css("display", "");
        $("#queryDiv #GWYPFWH").html(rowData.GWYPFWH);
        $("#queryDiv #GWYPFRQ").html(rowData.GWYPFRQ);
        $("#queryDiv #GWYPFBSMJ").html(rowData.GWYPFBSMJ);
    }
}

//打开报批项目查询表单
function openQuery(rowData) {
    $("#queryDiv").css("display", "");
    showNzzxm(rowData);
    showCsydqk(rowData);
    loadGyqkData(rowData)
    $("#queryDiv").dialog({
        width: 1000,
        title: "报批项目查询",
        collapsible: false,
        maximizable: false,
        maximized: true,
        resizable: false,
        draggable:false,
        modal: true,
        shadow: false,
        onClose: function () {
            $("#bppdZplDiv").css("display", "none");
            $("#bppdZplDiv").dialog("close");
        }
    });
}

//加载供应情况列表
function loadGyqkData(data) {
    $("#gyqkTable").datagrid({
        title: "供应情况",
        width: "100%",
        url: urlAuthority + "YGDBPXM/ShowGyqkList?callback=?",
        queryParams: { BPSLH: data.SLID },
        columns:
        [[
            { field: 'GY_BPID', title: '供应报批ID', align: "center", hidden: true },
            { field: 'QBSPDID', title: '签报审批单ID', align: "center", hidden: true },
            { field: 'HBJDSID', title: '划拨决定书ID', align: "center", hidden: true },
            { field: 'PZWHHB', title: '批复(准)文号-划拨', align: "center", hidden: true },
            { field: 'TDGYFS', title: '供应类型', align: "center", width: "20%" },
            {
                field: 'ZDBH', title: '宗地编号', align: "center", width: "20%", formatter: function (value, row, index) {
                    if (value == null) {
                        return value;
                    }
                    return '<a style="color:blue" href="javascript:void(0)" onclick="linkGyqk(\'' + index + '\')">' + value + '</a>';
                }
            },
            { field: 'XMMC', title: '项目名称', align: "center", width: "20%" },
            {
                field: 'PZWH', title: '批复(准)文号', align: "center", width: "20%", formatter: function (value, row, index) {
                    if (!row.TDGYFS.includes("出让")) {
                        return row.PZWHHB;
                    }
                    return value;
                }
            },
            { field: 'GDMJ', title: '供地面积(公顷)', align: "center", width: "20%" }
        ]],
        striped: true,//显示条纹
        singleSelect: true//单选模式
    });
}

//加载报批批单数据
function loadBppdZpData(PFWH) {
    $("#bppdZpTable").datagrid({
        title: "详细信息",
        width: "100%",
        nowrap: false,
        url: urlAuthority + "YGDBPXM/loadBppdZpData?callback=?",
        queryParams: { PFWH: PFWH },
        columns:
        [[
            { field: "ND", title: "年度", align: "center", width: "6%" },
            { field: "XZQ", title: "行政区", align: "center", width: "6%" },
            { field: "JSXMMC", title: "建设项目名称", align: "center", width: "16%" },
            { field: "SQYDDW", title: "申请用地单位", align: "center", width: "6%" },
            { field: "YDLB", title: "用地类别", align: "center", width: "6%" },
            { field: "PFWH", title: "批复文号", align: "center", width: "6%" },
            { field: "PFSJ", title: "批复时间", align: "center", width: "6%" },
            { field: "PZXMZMJ", title: "批准项目总面积", align: "center", width: "6%" },
            { field: "PZXMXZJSYDMJ", title: "批准项目新增建设用地面积", align: "center", width: "6%" },
            { field: "PZXMNYDMJ", title: "批准项目农用地面积", align: "center", width: "6%" },
            { field: "PZXMGDMJ", title: "批准项目耕地面积", align: "center", width: "6%" },
            { field: "PZXMJBNTMJ", title: "批准项目基本农田面积", align: "center", width: "6%" },
            { field: "PZXMJSYDMJ", title: "批准项目建设用地面积", align: "center", width: "6%" },
            { field: "PZXMWLYDMJ", title: "批准项目未利用地面积", align: "center", width: "6%" },
            { field: "XMWZ", title: "项目位置", align: "center", width: "6%" }
        ]],
        onLoadSuccess:function (data) {
            if (data.total > 0) {
                $("#queryDiv #PZWH").html("<a href='javascript:void(0)' onclick='linkBppdZp()'>" + PFWH + "</a>");
            }
        },
        striped: true,//显示条纹
        singleSelect: true//单选模式
    });
}

function linkGyqk(index) {
    var rowData = $("#gyqkTable").datagrid("getData").rows[index];
    var HBJDSID = rowData.HBJDSID;
    var SLID = rowData.GY_BPID;
    if (rowData.TDGYFS.includes("划拨")) {
        linkHbjds(HBJDSID, SLID);
    }
    else if (rowData.TDGYFS.includes("出让")) {
        linkCrht(SLID);
    }
    else {
        $.messager.alert("提示", "未查询到数据", "error");
        return;
    }
    $("#queryDiv").dialog("close");
}

function linkBpxm1(index) {
    var rowData = $("#bpxmTable1").datagrid("getData").rows[index];
    if (rowData.BPSLH == null) {
        return;
    }
    $.getJSON(urlAuthority + "YGDBPXM/GetQueryData?callback=?", { BPSLH: rowData.BPSLH }, function (json) {
        if (json == null) {
            $.messager.alert("提示", "未查询到数据", "error");
        } else {
            openQuery(json);
            $("#hbjdsDetailDiv").dialog("close");
        }
    });
}

function loadBpxmData1(SLID) {
    $("#bpxmTable1").datagrid({
        //title: "供应情况",
        width: "100%",
        url: urlAuthority + "YGDBPXM/ShowBpxmData?callback=?",
        queryParams: { GY_BPID: SLID },
        columns:
        [[
            { field: 'BPSLH', title: '报批受理号', align: "center", hidden: true },
            {
                field: 'PCMC', title: '项目名称', align: "center", width: "50%", formatter: function (value, row, index) {
                    if (row.BPSLH == null) {
                        return value;
                    } else {
                        return '<a style="color:blue" href="javascript:void(0)" onclick="linkBpxm1(' + index + ')">' + value + '</a>';
                    }
                }
            },
            { field: 'GDMJ', title: '出让面积(公顷)', align: "center", width: "50%" }
        ]],
        striped: true,//显示条纹
        singleSelect: true//单选模式
    });
}

function linkBpxm2(index) {
    var rowData = $("#bpxmTable2").datagrid("getData").rows[index];
    if (rowData.BPSLH == null) {
        return;
    }
    $.getJSON(urlAuthority + "YGDBPXM/GetQueryData?callback=?", { BPSLH: rowData.BPSLH }, function (json) {
        if (json == null) {
            $.messager.alert("提示", "未查询到数据", "error");
        } else {
            openQuery(json);
            $("#crhtDetailDiv").dialog("close");
        }
    });
}

function loadBpxmData2(SLID) {
    $("#bpxmTable2").datagrid({
        //title: "供应情况",
        width: "100%",
        url: urlAuthority + "YGDBPXM/ShowBpxmData?callback=?",
        queryParams: { GY_BPID: SLID },
        columns:
        [[
            { field: 'BPSLH', title: '报批受理号', align: "center", hidden: true },
            {
                field: 'PCMC', title: '项目名称', align: "center", width: "50%", formatter: function (value, row, index) {
                    if (row.BPSLH == null) {
                        return value;
                    } else {
                        return '<a style="color:blue" href="javascript:void(0)" onclick="linkBpxm2(' + index + ')">' + value + '</a>';
                    }
                }
            },
            { field: 'GDMJ', title: '出让面积(公顷)', align: "center", width: "50%" }
        ]],
        striped: true,//显示条纹
        singleSelect: true//单选模式
    });
}

//序列化表单对象
function serializeObject(form) {
    var o = {};
    $.each(form.serializeArray(), function (index) {
        if (o[this["name"]]) {
            o[this["name"]] = o[this["name"]] + "," + this["value"];
        } else {
            o[this["name"]] = this["value"];
        }
    })
    return o;
}

//自动填充表格数据
function autoSetValue(data, qName) {
    $.each(data, function (key, value) {
        if (qName.find("#" + key).length != 0) {
            qName.find("#" + key).html(value);
        }
    });
}

function linkHbjds(HBJDSID, SLID) {
    //var rowData = $("#hbjdsTable").datagrid("getData").rows[index];
    $.getJSON(urlAuthority + "YGDBPXM/ShowHbjdsDetail?callback=?", { HBJDSID: HBJDSID }, function (data) {
        autoSetValue(data, $("#hbjdsDetailTable"));
        loadBpxmData1(SLID);
    });
    $("#hbjdsDetailDiv").css("display", "");
    $("#hbjdsDetailDiv").dialog({
        width: 1000,
        title: "供应结果",
        collapsible: true,
        maximizable: true,
        maximized: true,
        resizable: true,
        modal: true,
        shadow: false,
        onClose: function () {
        }
    });
}

function linkCrht(SLID) {
    //var rowData = $("#hbjdsTable").datagrid("getData").rows[index];
    $.getJSON(urlAuthority + "YGDBPXM/ShowCrhtDetail?callback=?", { HTJBXXID: SLID }, function (data) {
        autoSetValue(data, $("#crhtDetailTable"));
        loadBpxmData2(SLID);
    });
    $("#crhtDetailDiv").css("display", "");
    $("#crhtDetailDiv").dialog({
        width: 1000,
        title: "供应结果",
        collapsible: true,
        maximizable: true,
        maximized: true,
        resizable: true,
        modal: true,
        shadow: false,
        onClose: function () {
        }
    });
}

//打开报批批单子表
function linkBppdZp() {
    $("#bppdZplDiv").dialog({
        width: 1000,
        title: " ",
        collapsible: true,
        maximizable: true,
        maximized: true,
        resizable: true,
        modal: true,
        shadow: false
    });
}

function formatCellTooltip(value) {
    if (!value) {
        return;
    }
    return "<span title='" + value + "'>" + value + "</span>";
}