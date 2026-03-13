// Enhanced baseball field with proper dimensions and positions

export const FIELD = {
  width: 600,
  height: 500,
  infieldSize: 150,
  moundDistance: 60,
  baseDistance: 40,
  
  // Actual baseball field dimensions (feet)
  realDimensions: {
    homeToFirst: 90,      // feet
    homeToSecond: 127.3, // feet (diagonal)
    homeToThird: 90,     // feet
    homeToHomePlate: 17, // feet (backstop to home)
    pitcherMoundToHome: 60.5, // feet
    outfieldMin: 325,    // feet to outfield wall
    outfieldMax: 400,    // feet to center
  }
};

// Enhanced position coordinates with proper baseball field layout
export const POSITIONS = {
  // Bases (actual positions)
  home: { x: 300, y: 450 },     // bottom center
  first: { x: 390, y: 360 },    // right
  second: { x: 300, y: 270 },   // center
  third: { x: 210, y: 360 },    // left
  
  // Infield
  pitcher: { x: 300, y: 330 },  // mound
  catcher: { x: 300, y: 420 },  // home plate
  
  // Standard defensive positions
  firstBase: { x: 390, y: 360 },      // 1B
  secondBase: { x: 300, y: 270 },     // 2B
  thirdBase: { x: 210, y: 360 },      // 3B
  shortstop: { x: 240, y: 330 },      // SS
  secondBaseman: { x: 360, y: 330 },  // 2B
  
  // Outfield
  leftField: { x: 120, y: 200 },      // LF
  centerField: { x: 300, y: 120 },    // CF
  rightField: { x: 480, y: 200 },     // RF
  
  // Additional positions for shifts
  leftFieldShift: { x: 180, y: 200 },    // LF shifted right
  rightFieldShift: { x: 420, y: 200 },  // RF shifted left
  shallowLeft: { x: 150, y: 280 },      // Shallow LF
  shallowRight: { x: 450, y: 280 },     // Shallow RF
  infieldIn: { x: 300, y: 380 },        // Infield in
};

// Fielder position templates for different situations
export const FIELDER_POSITIONS = {
  // Standard (no shift)
  standard: {
    pitcher: POSITIONS.pitcher,
    catcher: POSITIONS.catcher,
    firstBase: POSITIONS.firstBase,
    secondBase: POSITIONS.secondBaseman,
    thirdBase: POSITIONS.thirdBase,
    shortstop: POSITIONS.shortstop,
    leftField: POSITIONS.leftField,
    centerField: POSITIONS.centerField,
    rightField: POSITIONS.rightField,
  },
  
  // Shift vs left-handed pull hitter
  shiftVsLeft: {
    pitcher: POSITIONS.pitcher,
    catcher: POSITIONS.catcher,
    firstBase: POSITIONS.firstBase,
    secondBase: POSITIONS.rightFieldShift,
    thirdBase: POSITIONS.shallowLeft,
    shortstop: POSITIONS.secondBase,
    leftField: POSITIONS.rightFieldShift,
    centerField: POSITIONS.centerField,
    rightField: POSITIONS.shallowRight,
  },
  
  // Infield in (runners on third)
  infieldIn: {
    pitcher: POSITIONS.pitcher,
    catcher: POSITIONS.catcher,
    firstBase: POSITIONS.firstBase,
    secondBase: POSITIONS.secondBaseman,
    thirdBase: POSITIONS.thirdBase,
    shortstop: POSITIONS.shortstop,
    leftField: POSITIONS.leftField,
    centerField: POSITIONS.centerField,
    rightField: POSITIONS.rightField,
  },
  
  // No doubles (protect against extra base hits)
  noDoubles: {
    pitcher: POSITIONS.pitcher,
    catcher: POSITIONS.catcher,
    firstBase: POSITIONS.firstBase,
    secondBase: POSITIONS.secondBaseman,
    thirdBase: POSITIONS.thirdBase,
    shortstop: POSITIONS.shortstop,
    leftField: POSITIONS.shallowLeft,
    centerField: { x: 300, y: 150 }, // Deeper CF
    rightField: POSITIONS.shallowRight,
  },
};