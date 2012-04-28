jQuery(document).ready(function($) {
    var bg = chrome.extension.getBackgroundPage();
    var currentTown = false;
    
    function load() {
        loadTowns();
    }
    
    function selectTown(townId) {
        var town = bg.plugin.selectTown(parseInt(townId));
        if (!town) {
            alert("No such town found!");
            return;
        }
        loadFarms(town);
        currentTown = town;
    }
    
    function loadTowns() {
        $("#towns").html("").append("<option value='0'>Please select Town</option>");
        jQuery.each(bg.plugin.getTowns(), function(id, town) {
            if (currentTown && currentTown.id == town.id) {
                $("#towns").append("<option value='"+town.id+"' selected='selected'>"+town.title+"</option>");
            } else {
                $("#towns").append("<option value='"+town.id+"'>"+town.title+"</option>");
            }
        });
    }
    
    function loadFarms(town) {
        $("#farmList").html("");
        var farms = town.getFarms();
        for(var i = 0; i < farms.length; i++) {
            showNewFarm(farms[i]);
        }
    }
    
    function addFarm(farmId) {
        if (!currentTown) {
            alert("Please select town first !");
            return false;
        }
        if (currentTown.addFarm(farmId)) {
            showNewFarm(farmId);
        }
        bg.plugin.updateTown(currentTown);
        return true;
    }
    
    /**
     * Remove farm from memory
     */
    function removeFarm(farmId) {
        if (!currentTown) {
            alert("Please select town first !");
            return false;
        }
        if (currentTown.removeFarm(farmId)) {
            $("#"+farmId).detach();
        }
        bg.plugin.updateTown(currentTown);
        return true;
    }
    
    function showNewFarm(farmId) {
        var farm = $("<div></div>");
        farm.html("<img src=\"images/remove.png\" alt=\"Remove Farm\" class=\"removeFarm\"/>&nbsp;&nbsp;<span>"+farmId+"</span>");
        farm.attr("id", farmId).addClass("farmInfo");
        $("#farmList").append(farm);
    }
    
    /**
     * Load buildings
     */
//    function loadBuildingList() {
//        $("#availableBuildings").html("");
//        jQuery.each(bg.buildings.list(), function(name, data) {
//            $("#availableBuildings").append(data.asHtmlBuild());
//        });
//    }
//    
//    function loadBuildQueue() {
//        $("#queueBuildings").html("");
//        jQuery.each(bg.buildings.fakeQuele, function(index, build) {
//            $("#queueBuildings").append(build.asHtmlQueue());
//        });
//    }
//    
//    function loadCurrentBuilds() {
//        var builds = bg.buildings.getInProcess();
//        $("#current").html("");
//        jQuery.each(builds, function(index, build) {
//            $("#current").append(build.asHtml());
//        });
//    }
    
    $("#addFarm").click(function() {
        if ($("#addFarmId").val() != "") {
            addFarm($("#addFarmId").val());
        }
    });
    
    $(".removeFarm").live("click", function() {
        if (confirm("Are you sure ?")) {
            removeFarm($(this).parent().attr("id"));
        }
    });
    
    
    /**
     * New town selected
     */
    $("#towns").change(function() {
        selectTown(parseInt($(this).val()));
    });
    
//    $("#buildingsLoad").button().click(function() {
//        loadBuildingList();
//    });
//    
//    /**
//     * Build building
//     */
//    $(".build").live("click", function() {
//        if (!confirm("Add building to quele ?")) {
//            return false;
//        }
//        var name = $(this).attr("bname");
//        var build = bg.buildings.getBuild(name);
//        if (!(build instanceof bg.Building)) {
//            window.alert("Couldn't find building !");
//            return false;
//        }
//        bg.buildings.addToQuele(build);
//        loadBuildQueue();
//    });
//    
//    $(".building .trash").live("click", function() {
//        if(!confirm("Are you sure ?")) {
//            return false;
//        }
//        var name = $(this).attr("bname");
//        var level = $(this).attr("blevel");
//        bg.buildings.removeFromQuele(name, level);
//        loadBuildQueue();
//    });
//    
//    loadBuildingList();
//    loadBuildQueue();
//    loadCurrentBuilds();
//    setInterval(loadBuildQueue, 10000);
//    setInterval(loadCurrentBuilds, 30000);
//    
//    
//    $("#reloadQueue").button({
//        icons: {
//            primary: "ui-icon-refresh"
//        }
//    }).click(function() {
//        loadBuildQueue();
//    });
//    
//    $("#saveQueue").button({
//        icons: {
//            primary: "ui-icon-disk"
//        }
//    }).click(function() {
//        bg.buildings.storeQueue();
//    });
//    
//    $("#clearQueue").button({
//        icons: {
//            primary: "ui-icon-document"
//        }
//    }).click(function() {
//        bg.buildings.clearQueue();
//        loadBuildQueue();
//    });
//    
//    $("#test").click(function() {
//        bg.callServer({action: "test"}, function(resp) {
//            console.log(resp);
//        }, function() { //and on error
//            
//        });
//    });
    
    /**
     * Add new town dialog 
     */
    $("#newTownForm").dialog({
        autoOpen: false,
        buttons: {
            Cancel: function() {
                $("#newTownForm").dialog("close");
            }, 
            Save: function() {
                if ($("#form-town-id").val() == "") {
                    alert("No town Id");
                    return;
                }
                if ($("#form-town-title").val() == "") {
                    alert("No town Title");
                    return;
                }
                var town = new bg.Town({
                    id: parseInt($("#form-town-id").val()),
                    title: $("#form-town-title").val()
                });                
                bg.plugin.addTown(town);
                loadTowns();
                $("#newTownForm").dialog("close");
            }
        }
    });
    
    $("#newTown").button({
        icons: {
            primary: "ui-icon-plusthick"
        }
    }).click(function() {
        $("#newTownForm").dialog('open');
    });
    
    
    
    
    
    /*
     * DnD support
     */
    
//    Element.prototype.hasClassName = function(name) {
//      return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
//    };
//
//    Element.prototype.addClassName = function(name) {
//      if (!this.hasClassName(name)) {
//        this.className = this.className ? [this.className, name].join(' ') : name;
//      }
//    };
//
//    Element.prototype.removeClassName = function(name) {
//      if (this.hasClassName(name)) {
//        var c = this.className;
//        this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
//      }
//    };
//
//
//    function handleDragEnter(e) {
//      // this / e.target is the current hover target.
//      document.getElementById("queueBuildings").addClassName('over');
//    }
//
//    function handleDragLeave(e) {
//      document.getElementById("queueBuildings").removeClassName('over');  // this / e.target is previous target element.
//    }
//    
//    var queue = document.getElementById("queue");
//    queue.addEventListener('dragenter', handleDragEnter, false);
//    queue.addEventListener('dragleave', handleDragLeave, false);
    //
    
    
    
    load();
});

