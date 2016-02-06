var week = {
  monday : false,
  tuesday : false,
  wednesday : false,
  thursday : false,
  friday : false,
  saturday : false,
  sunday : false
};

var weekWithAvailableWkdays = {
  monday : true,
  tuesday : true,
  wednesday : true,
  thursday : true,
  friday : true,
  saturday : false,
  sunday : false
};

// Add schedule objects for presenters
db.users.find({type: 1}).forEach(function (user) {
  var timeline = {};
  var counter = 12;

  for(var i = 0; i < 25; i++){
    var hour = counter++ % 13;
    var splits = i > 12 ? 'pm' : 'am';

    if(hour !== 12)
      hour += 1;

  	timeline[hour+'00' + splits] = (i > 9 && i < 19 && i !== 12) ? weekWithAvailableWkdays : week;
  	timeline[hour+'30' + splits] = (i > 9 && i < 19 && i !== 12) ? weekWithAvailableWkdays : week;
  }
  
  // ObjectId.toString renders the string "ObjectId('blah')" so we literally have to slice
  var userId = user._id.toString().slice(10, 34);
  
  var schedule = {
    user : {
      id : userId,
      type : user.type
    },
    availability : timeline
  };
  db.schedules.insert(schedule);
});
