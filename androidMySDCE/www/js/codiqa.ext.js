/* Set web = true to debug as a web-page, false on a mobile device */
var web = 'false';
console.log("Web: " + web);

var update_idCard = '';

document.addEventListener("deviceready", onDeviceReady, false);

/* Declare the pouch database access variable in the global scope */
var db;

if (web) {
    onDeviceReady();
}

function onDeviceReady() {
    console.log("Cordova is ready");

    if (!web) {
        /* Check the Android version to see if Pouch DB is supported */
        var androidVer = device.version;
        console.log("Android Version: ", androidVer);

        /* Get the major revision of Android software */
        var androidVerInt = parseInt(androidVer, 10);

        /* If the version is greater than 4, then Pouch DB is supported */
        if (androidVerInt >= 4) {
            console.log("Android version is ok for pouch DB :)");
        } else {
            console.log("Android version won't work with pouch DB :(");
            /* Hide the Classes button if we can't access pouch DB */
            $("#myClassesBtn").hide();
        }
    }

    /* Create the Pouch DB database */
    db = new PouchDB("sdceClasses");

    /* Show the classes on the MyClasses screen */
    showClasses();

    /* After the device is loaded, hide the splash screen */
    if (!web) {
        navigator.splashscreen.hide();
    }

    /*
     /!* When there are changes run the showClasses function to update the screen *!/
     db.info()
     .then(function (result) {
     db.changes({
     since: result.update_seq,
     live: true
     }).on("change", showClasses);
     }).catch(function (err) {
     console.log("Error extracting db.info: " + err);
     });
     */

} // End of onDeviceReady function

/* add a class to the Pouch DB database */
function addClasses() {
    console.log("addClasses");
    var the_id = document.getElementById("add_id").value;
    var theCourse = document.getElementById("addCourse").value;
    var theClass = document.getElementById("addClass").value;
    var theInstructor = document.getElementById("addInstructor").value;
    var theStartDate = document.getElementById("addStartDate").value;
    var theEndDate = document.getElementById("addEndDate").value;
    var theDays = document.getElementById("addDays").value;
    var theStartTime = document.getElementById("addStartTime").value;
    var theEndTime = document.getElementById("addEndTime").value;
    var theLocation = document.getElementById("addLocation").value;
    var theRoom = document.getElementById("addRoom").value;
    var theCategory = document.getElementById("addCategory").value;

    var aClass = {
        _id: the_id,
        Course: theCourse,
        Class: theClass,
        Instructor: theInstructor,
        StartDate: theStartDate,
        EndDate: theEndDate,
        Days: theDays,
        StartTime: theStartTime,
        EndTime: theEndTime,
        Location: theLocation,
        Room: theRoom,
        Category: theCategory
    };
    console.log(aClass);
    db.put(aClass)
        .then(function (response) {
            console.log("Record added successfully!!!");
            document.getElementById("messages").innerHTML = "Class added!!!";
            clearFields();
        }).catch(function (err) {
            console.log("Error putting class data: ", err);
            document.getElementById("messages").innerHTML = "Error adding class data: " + err;
        });
} // End of addClasses function

function clearFields() {
    console.log("clearClasses");
    document.getElementById("classForm").reset();
    document.getElementById("messages").innerHTML = "";
} // End of clearFields function

function showClasses() {
    console.log("showClasses");
    db.allDocs({
        include_docs: true,
        ascending: true,
        attachments: true
    }).then(function (result) {
        console.log("Got the documents ok");
        /*showTableOfClasses(result.rows);*/
        showCardsOfClasses(result.rows);
        document.getElementById("messages").innerHTML = "";
    }).catch(function (err) {
        console.log("Error fetching documents: " + err);
    });
} // End of showClasses function

function showTableOfClasses(data) {
    console.log("showTableOfClasses");
    var div = document.getElementById("theResult");
    if (data.length > 0) {
        var result = '<table class="ui-body-d ui-shadow table-stripe ui-responsive" ' +
            'id="table-custom-2" ' +
            'data-role="table" ' +
            'data-mode="column-toggle" data-column-popup-theme="a" ' +
            'data-column-btn-text="Columns..." data-column-btn-theme="a" id="classTable">';
        /*var result = '<table border="1" id="classTable">';*/
        result += "<thead>";
        result += "<tr class='ui-bar-d'>";
        result += "<th>Id</th>";
        result += "<th data-priority='1'>Course</th>";
        result += "<th data-priority='2'>Class</th>";
        result += "<th data-priority='3'>Instructor</th>";
        result += "<th data-priority='4'>Start Date</th>";
        result += "<th data-priority='5'>End Date</th>";
        result += "<th data-priority='6'>Days</th>";
        result += "<th>Start Time</>";
        result += "<th>End Time</th>";
        result += "<th>Location</>";
        result += "<th>Room</th>";
        result += "<th>Category</>";
        result += "<th>Delete</th>";
        result += "</tr>";
        result += "</thead>";
        result += "<tbody>";
        for (i = 0; i < data.length; i++) {
            result += "<tr>";
            result += "<td>" + data[i].doc._id + "</td>";
            result += "<td>" + data[i].doc.Course + "</td>";
            result += "<td>" + data[i].doc.Class + "</td>";
            result += "<td>" + data[i].doc.Instructor + "</td>";
            result += "<td>" + data[i].doc.StartDate + "</td>";
            result += "<td>" + data[i].doc.EndDate + "</td>";
            result += "<td>" + data[i].doc.Days + "</td>";
            result += "<td>" + data[i].doc.StartTime + "</td>";
            result += "<td>" + data[i].doc.EndTime + "</td>";
            result += "<td>" + data[i].doc.Location + "</td>";
            result += "<td>" + data[i].doc.Room + "</td>";
            result += "<td>" + data[i].doc.Category + "</td>";
            result += "<td>" + "<input type='button' value='Delete' onclick='deleteDoc(" +
                '"' + data[i].doc._id + '"' + ");'></td>";
            result += "</tr>";
        }
        result += "</tbody>";
        result += "</table>";
    } else {
        result = "No classes in the database.";
    }
    div.innerHTML = result;
    // Add a setTimeout to allow the DOM to get updated
    /*
     setTimeout(function () {
     start = new Date();
     end = start.setSeconds(start.getSeconds() + 1);

     do {
     start = new Date();
     } while (end - start > 0);
     }, 2)
     */
} // End of showTableOfClasses function

function showCardsOfClasses(data) {
    console.log("showCardsOfClasses");
    var div = document.getElementById("theResult");

    if (data.length > 0) {
        var result = "";
        for (i = 0; i < data.length; i++) {
            if (update_idCard == data[i].doc._id) {
                /* Display an update record */
                result += '<div data-role="collapsible" data-collapsed="false">';
                result += '<h3>';
                result += 'Update ' + data[i].doc.Class;
                result += '</h3>';
                result += '<fieldset class="ui-grid-solo">';
                result += '<div class="ui-blck-a">';
                result += '<strong>Title: </strong>';
                result += '<input type="text" name="updateClass" id="updateClass" placeholder="' +
                    data[i].doc.Class + '">';
                result += '</div>';
                result += '<div class="ui-block-a">';
                result += '<strong>Instructor: </strong>';
                result += '<input type="text" name="updateInstructor" id="updateInstructor" placeholder="' +
                    data[i].doc.Instructor + '">';
                result += '</div>';
                result += '<div class="ui-block-a">';
                result += '<strong>Location: </strong>';
                result += '<input type="text" name="updateLocation" id="updateLocation" placeholder="' +
                    data[i].doc.Location + '">';
                result += '</div>';
                result += '<div class="ui-block-a">';
                result += '<strong>Category: </strong>';
                result += '<input type="text" name="updateCategory" id="updateCategory" placeholder="' +
                    data[i].doc.Category + '">';
                result += '</div>';
                result += '</fieldset>';
                result += '<fieldset class="ui-grid-a">';
                result += '<div class="ui-block-a">';
                result += '<strong>ID: </strong>';
                result += '<input type="text" name="update_id" id="update_id" placeholder="' +
                    data[i].doc._id + '">';
                result += '</div>';
                result += '<div class="ui-block-b">';
                result += '<strong>CRN: </strong>';
                result += '<input type="text" name="updateCourse" id="updateCourse" placeholder="' +
                    data[i].doc.Course + '">';
                result += '</div>';
                result += '</fieldset>';
                result += '<fieldset class="ui-grid-b">';
                result += '<div class="ui-block-a">';
                result += '<strong>Days: </strong>';
                result += '<input type="text" name="updateDays" id="updateDays" placeholder="' +
                    data[i].doc.Days + '">';
                result += '</div>';
                result += '<div class="ui-block-b">';
                result += '<strong>Start Date: </strong>';
                result += '<input type="text" name="updateStartDate" id="updateStartDate"';
                result += 'data-role="date" placeholder="' +
                    data[i].doc.StartDate + '">';
                result += '</div>';
                result += '<div class="ui-block-c">';
                result += '<strong>Start Time: </strong>';
                result += '<input type="text" name="updateStartTime" id="updateStartTime" placeholder="' +
                    data[i].doc.StartTime + '">';
                result += '</div>';
                result += '</fieldset>';
                result += '<fieldset class="ui-grid-b">';
                result += '<div class="ui-block-a">';
                result += '<strong>Room: </strong>';
                result += '<input type="text" name="updateRoom" id="updateRoom" placeholder="' +
                    data[i].doc.Room + '">';
                result += '</div>';
                result += '<div class="ui-block-b">';
                result += '<strong>End Date: </strong>';
                result += '<input type="text" name="updateEndDate" id="updateEndDate" data-role="date"';
                result += 'placeholder="' + data[i].doc.EndDate + '">';
                result += '</div>';
                result += '<div class="ui-block-c">';
                result += '<strong>End Time: </strong>';
                result += '<input type="text" name="updateEndTime" id="updateEndTime" placeholder="' +
                    data[i].doc.EndTime + '">';
                result += '</div>';
                result += '</fieldset>';
                result += '<fieldset class="ui-grid-a">';
                result += '<div class="ui-block-a">';
                result += '<input type="button" value="Update Class" data-icon="check"' +
                    'onclick="updateClasses();">';
                result += '</div>';
                result += '<div class="ui-block-b">';
                result += '<input type="button" value="Cancel" data-icon="delete" onclick="clearUpdateFlag();">';
                result += '</div>';
                result += '</fieldset>';
                result += '</div>';
            } else {
                /* Display a regular record */
                result += '<div data-role="collapsible">';
                result += '<h3>';
                result += data[i].doc.Class + '&nbsp;&nbsp;' + data[i].doc.Instructor;
                result += '</h3>';
                result += '<div>';
                result += '<fieldset class="ui-grid-solo">';
                result += '<div class="ui-blck-a">';
                result += '<strong>Title: </strong>' + data[i].doc.Class;
                result += '</div>';
                result += '<div class="ui-blck-a">';
                result += '<strong>Instructor: </strong>' + data[i].doc.Instructor;
                result += '</div>';
                result += '<div class="ui-blck-a">';
                result += '<strong>Location: </strong>' + data[i].doc.Location;
                result += '</div>';
                result += '<div class="ui-blck-a">';
                result += '<strong>Category: </strong>' + data[i].doc.Category;
                result += '</div>';
                result += '</fieldset>';
                result += '<fieldset class="ui-grid-c">';
                result += '<div class="ui-block-a">';
                result += '<strong>ID: </strong>' + data[i].doc._id;
                result += '</div>';
                result += '<div class="ui-block-b">';
                result += '<strong>CRN: </strong>' + data[i].doc.Course;
                result += '</div>';
                result += '<div class="ui-block-c">';
                result += '<strong>Room: </strong>' + data[i].doc.Room;
                result += '</div>';
                result += '<div class="ui-block-d">';
                result += '<strong>Days: </strong>' + data[i].doc.Days;
                result += '</div>';
                result += '</fieldset>';
                result += '<fieldset class="ui-grid-c">';
                result += '<div class="ui-block-a">';
                result += '<strong>Start Date: </strong>' + data[i].doc.StartDate;
                result += '</div>';
                result += '<div class="ui-block-b">';
                result += '<strong>End Date: </strong>' + data[i].doc.EndDate;
                result += '</div>';
                result += '<div class="ui-block-c">';
                result += '<strong>Start Time: </strong>' + data[i].doc.StartTime;
                result += '</div>';
                result += '<div class="ui-block-d">';
                result += '<strong>End Time: </strong>' + data[i].doc.EndTime;
                result += '</div>';
                result += '</fieldset>';
                result += '<fieldset class="ui-grid-a">';
                result += '<div class="ui-block-a">';
                result += '<input type="button" value="Update" data-icon="back" onclick="setUpdateFlag(' +
                    data[i].doc._id + ');">';
                result += '</div>';
                result += '<div class="ui-block-b">';
                result += '<input type="button" value="Delete" data-icon="delete" onclick="removeDoc(' +
                    data[i].doc._id + ');">';
                result += '</div>';
                result += '</fieldset>';
                result += '</div>';
                result += '</div>';
                result += '<hr>';
            }
        }
    } else {
        result = "No classes in the database.";
    }
    div.innerHTML = result;
    // Add a setTimeout to allow the DOM to get updated
    setTimeout(function () {
        start = new Date();
        end = start.setSeconds(start.getSeconds() + 1);

        do {
            start = new Date();
        } while (end - start > 0);
    }, 2)

} // End of showCardsOfClasses function

function removeDoc(key) {

    console.log("removeDoc: key = " + key);
    db.get(key.toString())
        .then(function (doc) {
            return db.remove(doc)
                .then(function (result) {
                    console.log("Row: " + key + " removed.");
                }).catch(function (err) {
                    console.log("Error removing doc: " + key + " Error: " + err);
                });
        })
        .catch(function (err) {
            console.log("Error getting document: " + key + " Error: " + err);
        });

} // End of removeDoc function

function deleteDoc(key) {
    console.log("deleteDoc: key = " + key);
    db.get(key.toString())
        .then(function (doc) {
            return db.remove(doc)
                .then(function (result) {
                    console.log("Row: " + key + " removed.");
                    showClasses();
                }).catch(function (err) {
                    console.log("Error removing doc: " + key + " Error: " + err);
                });
        })
        .catch(function (err) {
            console.log("Error getting document: " + key + " Error: " + err);
        });
}

function loadClasses() {
    console.log("loadClasses: classSch=", classSch);

    db.bulkDocs(classSch)
        .then(function (result) {
            console.log("Bulk data load successful!");
            showClasses();
        }).catch(function (err) {
            console.log("Error bulk loading data, error=", err);
        });
} // End of loadClasses function

function setUpdateFlag(updateKey) {
    update_idCard = updateKey;
    showClasses();
} // End of setUpdateFlag function

function clearUpdateFlag() {
    update_idCard = '';
    showClasses();
} // End of clearUpdateFlag function

function updateClasses() {
    console.log("updateClasses");
    var the_id = document.getElementById("update_id").value;
    var theCourse = document.getElementById("updateCourse").value;
    var theClass = document.getElementById("updateClass").value;
    var theInstructor = document.getElementById("updateInstructor").value;
    var theStartDate = document.getElementById("updateStartDate").value;
    var theEndDate = document.getElementById("updateEndDate").value;
    var theDays = document.getElementById("updateDays").value;
    var theStartTime = document.getElementById("updateStartTime").value;
    var theEndTime = document.getElementById("updateEndTime").value;
    var theLocation = document.getElementById("updateLocation").value;
    var theRoom = document.getElementById("updateRoom").value;
    var theCategory = document.getElementById("updateCategory").value;

    console.log("updateClasses: id=", the_id);
    db.get(the_id.toString())
        .then(function (doc) {
            return db.put({
                _id: doc._id,
                _rev: doc._rev,
                Course: theCourse,
                Class: theClass,
                Instructor: theInstructor,
                StartDate: theStartDate,
                EndDate: theEndDate,
                Days: theDays,
                StartTime: theStartTime,
                EndTime: theEndTime,
                Location: theLocation,
                Room: theRoom,
                Category: theCategory
            })
                .then(function (result) {
                    console.log("Row: " + the_id + " updated.");
                    clearFields();
                    showClasses();
                }).catch(function (err) {
                    console.log("Error removing doc: " + the_id + " Error: " + err);
                });
        })
        .catch(function (err) {
            console.log("Error getting document during update: " + the_id + " Error: " + err);
            document.getElementById("update_id").value = "";
            document.getElementById("updateCourse").value = "";
            document.getElementById("updateClass").value = "";
            document.getElementById("updateInstructor").value = "";
            document.getElementById("updateStartDate").value = "";
            document.getElementById("updateEndDate").value = "";
            document.getElementById("updateDays").value = "";
            document.getElementById("updateStartTime").value = "";
            document.getElementById("updateEndTime").value = "";
            document.getElementById("updateLocation").value = "";
            document.getElementById("updateRoom").value = "";
            document.getElementById("updateCategory").value = "";
        });
} // End of updateClasses function

function cleanDatabase() {
    console.log("cleanDatabase");
    db.allDocs({
        include_docs: true,
        ascending: true,
        attachments: true
    }).then(function (result) {
        console.log("Got the documents for cleanDatabase ok.");
        for (i = 0; i < result.rows.length; i++) {
            removeDoc(result.rows[i].doc._id);
        }
        document.getElementById("messages").innerHTML = "";
    }).catch(function (err) {
        console.log("Error fetching documents: " + err);
    });
} // End of showClasses function

function customize() {
    // -Plain old variable holding a value:
    // var userName = prompt("Please Enter Your Name");
    // -HTML5 Local Storage, holding a more permanent value:
    localStorage.userName = prompt("Please Enter Your Name");
    // -Accessing a plain old variable:6
    // document.getElementById("welcomeMsg").innerHTML = "Welcome, " + userName;
    // -HTML5 Local Storage, accessing a value in localStorage
    // document.getElementById("welcomeMsg").innerHTML = "Welcome, " + localStorage.userName;
    $(".welcomeMsg").html(", " + localStorage.userName);
} // End of customize function

function loadName() {
    if (localStorage.userName == undefined) {
        // True result
        // document.getElementById("welcomeMsg").innerHTML = "Welcome, friend";
        // $(".welcomeMsg").html(", friend.");
    } else {
        // False result
        // document.getElementById("welcomeMsg").innerHTML = "Welcome, " + localStorage.userName;
        $(".welcomeMsg").html(", " + localStorage.userName);
    }
} // End of loadName function

function getURL(url) {
    cordova.InAppBrowser.open(url, '_blank', 'location=yes');
} // End of getURL function

function emailUs() {
    window.plugins.socialsharing.shareViaEmail(
        'Comment about your app:<br>', // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
        'mySDCE App Feedback',
        ['scottnakada@gmail.com'], // TO: must be null or an array
        null, // CC: must be null or an array
        null, // BCC: must be null or an array
        ['www/images/icon96.png'], // FILES: can be null, a string, or an array
        function (result) {
            console.log('result: ' + result)
        }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
        function (error) {
            console.log('error: ' + error)
        } // called when sh*t hits the fan
    );
};

function shareApp() {
    window.plugins.socialsharing.share(
        'Check out ther mySDCE App!',						// Message
        'mySDCE App Download',								// Subject
        'www/images/icon96.png',							// Image
        'https://play.google.com/store/apps/details?id=com.pmdinteractive.instructorvictor',// Link back to app in store
        function (result) {
            console.log('result: ' + result)
        }, // called when sharing worked
        function (error) {
            console.log('error: ' + error)
        } 	// called when sh*t hits the fan
    );
};