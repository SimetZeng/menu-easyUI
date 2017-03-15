/**
 * Created by 曾玉华 on 2017/3/8.
 * 左边栏控件,仿XP效果,点选分组标题时,自动选择第一项
 * 使用.whmenu()进行数据初使化,
 * 使用whmenuSelect(NodeID)方法选择特定项
 */

(function($) {
	var curSelectNodeId = undefined;
	var onItemClick = undefined;

	//当菜单项被点击的时候，调用方法：判断是否是当前节点（whmenuSelect）
	function onWhMenuItemClick() {
		var node = $(this).data("nodedata");

		$(this).whmenuSelect(node.id);
		return false;
	}

	//选择节点：通过节点id进行判断
	function selectNode(selectNodeId) {
		curSelectNodeId = selectNodeId;
		var isFound = false;
		//循环每一个a链接，判断是否是当前选择的节点，如果是移除选中效果，如果不是添加选中效果
		//并且设置变量isFound为true
		$(".menulink").each(function(i, target) {
			if($(target).data("nodedata").id != selectNodeId) {
				$(target).removeClass("itemSelected");
			}
			else{
				$(target).addClass("itemSelected");
				isFound = true;
				if(onItemClick != undefined){
					onItemClick.call($(target), $(target).data("nodedata"));
				}
			}
		});

		//判断如果找到了，循环每个父级，找到当前父级下的第一个子级并让其选中
		if(!isFound) {
			$(".whmenu .easyui-panel").each(function(i,target){
				var node = $(target).data("nodedata");
				if(node.id == selectNodeId){
					if(node.nodes.length > 0){
						selectNode(node.nodes[0].id);
					}
					// return;
				}
			});
		}
	}

	//扩展的方法：用于判断是否是当前选中
	$.fn.whmenuSelect = function(nodeId) {
		if(nodeId == curSelectNodeId) {
			return;
		}
		selectNode(nodeId);
	};

	$.fn.whmenu = function(data) {
		this.empty();
		var $self = this;
		//一级标题
		$.each(data.nodes, function(i, node) {
			var $panelDiv = $('<div class="easyui-panel"></div>');
			var ulElement=$("<ul></ul>");

			$panelDiv.append(ulElement);
			$panelDiv.attr("title", node.name);
			$panelDiv.attr("data-nodeData", JSON.stringify(node));
			if(node.icon!=undefined){
				$panelDiv.attr("iconCls", node.icon);
			}

			//二级标题
			$.each(node.nodes, function(j, subNode) {

				var liElement=$('<li></li>');
				var btn = $('<a class="easyui-linkbutton menulink" href="#" ' +
							'data-options="iconCls:\''
							+ subNode.icon +'\'">'+ subNode.name +'</a>');
				btn.attr("data-nodeData", JSON.stringify(subNode));

				liElement.append(btn);
				ulElement.append(liElement);
			});
			$self.append($panelDiv);
		});
		$.parser.parse(this[0]);	//使easyUI样式生效

		onItemClick = window[data.onSelectChanged];
		//a标签样式变化
		$('.menulink').click(onWhMenuItemClick);

		//给每个panel的标题附元素
		$('.whmenu .panel-header').each(function() {
			$(this).data("nodedata", $(this).next(".whmenu .easyui-panel").data("nodedata"));
		});

        $('.whmenu .panel-header').click(onWhMenuItemClick);
	}

})(jQuery);