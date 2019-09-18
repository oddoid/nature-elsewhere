/** The Atlas.Animation identifier. These are used to reference immutable image
    source properties, such as dimensions and animation duration, from the
    Atlas. These animations are mostly referenced directly from entity configs
    but also in some cases where Images are instantiated or manipulated
    dynamically in code. */
export enum AnimationID {
  CHAR_ARROW_DIAGONAL = 'arrow upRight',
  CHAR_ARROW_HORIZONTAL = 'arrow right',
  CHAR_ARROW_VERTICAL = 'arrow up',
  CHAR_BACKPACKER_IDLE_DOWN = 'backpacker idleDown',
  CHAR_BACKPACKER_IDLE_HORIZONTAL = 'backpacker idleRight',
  CHAR_BACKPACKER_IDLE_UP = 'backpacker idleUp',
  CHAR_BACKPACKER_WALK_DOWN = 'backpacker walkDown',
  CHAR_BACKPACKER_WALK_HORIZONTAL = 'backpacker walkRight',
  CHAR_BACKPACKER_WALK_HORIZONTAL_SHADOW = 'backpacker walkRightShadow',
  CHAR_BACKPACKER_WALK_UP = 'backpacker walkUp',
  CHAR_BACKPACKER_WALK_VERTICAL_SHADOW = 'backpacker walkUpDownShadow',
  CHAR_BEE = 'bee',
  CHAR_BEE_BLOOD = 'bee deadBlood',
  CHAR_BEE_DEAD = 'bee dead',
  CHAR_BEE_DEAD_SHADOW = 'bee deadShadow',
  CHAR_BEE_SHADOW = 'bee shadow',
  CHAR_BIRD_FLY = 'bird fly',
  CHAR_BIRD_REST = 'bird rest',
  CHAR_BIRD_RISE = 'bird rise',
  CHAR_BUNNY_BLOOD = 'bunny blood',
  CHAR_BUNNY = 'bunny',
  CHAR_BUNNY_DEAD = 'bunny dead',
  CHAR_BUNNY_SHADOW = 'bunny shadow',
  CHAR_FROG_EAT = 'frog eat',
  CHAR_FROG_IDLE = 'frog idle',
  CHAR_FROG_IDLE_SHADOW = 'frog idleShadow',
  CHAR_FROG_LEAP = 'frog leap',
  CHAR_PIG = 'pig',
  CHAR_SNAKE_SHADOW = 'snake shadow',
  CHAR_SNAKE = 'snake',
  PALETTE_BLACK = 'palette black',
  PALETTE_BLUE = 'palette blue',
  PALETTE_DARK_GREEN = 'palette darkGreen',
  PALETTE_GREEN = 'palette green',
  PALETTE_GREY = 'palette grey',
  PALETTE_LIGHT_BLUE = 'palette lightBlue',
  PALETTE_LIGHT_GREEN = 'palette lightGreen',
  PALETTE_LIGHT_GREY = 'palette lightGrey',
  PALETTE_ORANGE = 'palette orange',
  PALETTE_PALE_GREEN = 'palette paleGreen',
  PALETTE_RED = 'palette red',
  PALETTE_TRANSPARENT = 'palette transparent',
  PALETTE_WHITE = 'palette white',
  SCENERY_BUSH = 'bush',
  SCENERY_BUSH_SHADOW = 'bush shadow',
  SCENERY_CATTAILS = 'cattails',
  SCENERY_CLOUD_CLOUD = 'cloud',
  SCENERY_CLOUD_PUDDLE = 'rain pool',
  SCENERY_CLOUD_RAIN = 'rain',
  SCENERY_CLOUD_SHADOW = 'cloud shadow',
  SCENERY_CLOUD_SPLASH = 'rain-splash',
  SCENERY_CLOUD_SPRINKLE = 'sprinkle',
  SCENERY_CLOVER_0_0 = 'clover 0-0',
  SCENERY_CLOVER_0_1 = 'clover 0-1',
  SCENERY_CLOVER_0_2 = 'clover 0-2',
  SCENERY_CLOVER_0_3 = 'clover 0-3',
  SCENERY_CLOVER_0_4 = 'clover 0-4',
  SCENERY_CLOVER_1_0 = 'clover 1-0',
  SCENERY_CLOVER_1_1 = 'clover 1-1',
  SCENERY_CLOVER_1_2 = 'clover 1-2',
  SCENERY_CLOVER_1_3 = 'clover 1-3',
  SCENERY_CLOVER_1_4 = 'clover 1-4',
  SCENERY_CONIFER = 'conifer',
  SCENERY_CONIFER_SHADOW = 'conifer shadow',
  SCENERY_FLAG = 'flag',
  SCENERY_FLAG_SHADOW = 'flag shadow',
  SCENERY_GRASS_0 = 'grass 0',
  SCENERY_GRASS_10 = 'grass 10',
  SCENERY_GRASS_1 = 'grass 1',
  SCENERY_GRASS_2 = 'grass 2',
  SCENERY_GRASS_3 = 'grass 3',
  SCENERY_GRASS_4 = 'grass 4',
  SCENERY_GRASS_5 = 'grass 5',
  SCENERY_GRASS_6 = 'grass 6',
  SCENERY_GRASS_7 = 'grass 7',
  SCENERY_GRASS_8 = 'grass 8',
  SCENERY_GRASS_9 = 'grass 9',
  SCENERY_ISO_GRASS = 'isoGrass /0',
  SCENERY_MOUNTAIN = 'mountain',
  SCENERY_MOUNTAIN_SHADOW = 'mountain shadow',
  SCENERY_PATH_CORNER_E = 'path >',
  SCENERY_PATH_CORNER_N = 'path ^',
  SCENERY_PATH_NE = 'path /',
  SCENERY_POND = 'pond',
  SCENERY_PYRAMID = 'pyramid',
  SCENERY_PYRAMID_SHADOW = 'pyramid shadow',
  SCENERY_SUBSHRUB_SHADOW = 'subshrub shadow',
  SCENERY_SUBSHRUB = 'subshrub',
  SCENERY_TREE_SHADOW = 'tree shadow',
  SCENERY_TREE = 'tree',
  UI_CHECKERBOARD_BLACK_TRANSPARENT = 'checkerboard blackTransparent',
  UI_CHECKERBOARD_BLACK_WHITE = 'checkerboard blackWhite',
  UI_CHECKERBOARD_BLUE_GREY = 'checkerboard blueGrey',
  UI_CONTROLLER_MAPPING_INPUT_DOWN = 'ui-controller-mapping-input down',
  UI_CONTROLLER_MAPPING_INPUT_LEFT = 'ui-controller-mapping-input left',
  UI_CONTROLLER_MAPPING_INPUT_MENU = 'ui-controller-mapping-input menu',
  UI_CONTROLLER_MAPPING_INPUT_RIGHT = 'ui-controller-mapping-input right',
  UI_CONTROLLER_MAPPING_INPUT_UP = 'ui-controller-mapping-input up',
  UI_CONTROLLER_MAPPING_SOURCE_GAMEPAD = 'ui-controller-mapping-source gamepad',
  UI_CONTROLLER_MAPPING_SOURCE_KEYBOARD = 'ui-controller-mapping-source keyboard',
  UI_DECREASE = 'ui decrease',
  UI_DELETE = 'ui delete',
  UI_DESTINATION = 'destination',
  UI_EDITOR_BUTTON_ADD = 'ui-editor-button add',
  UI_EDITOR_BUTTON_BASE = 'ui-editor-button base',
  UI_EDITOR_BUTTON_DECREMENT = 'ui-editor-button decrement',
  UI_EDITOR_BUTTON_GRID = 'ui-editor-button grid',
  UI_EDITOR_BUTTON_INCREMENT = 'ui-editor-button increment',
  UI_EDITOR_BUTTON_PRESSED = 'ui-editor-button pressed',
  UI_EDITOR_BUTTON_REMOVE = 'ui-editor-button remove',
  UI_GRID = 'grid',
  UI_INCREASE = 'ui increase',
  UI_LOGO = 'logo',
  UI_MEM_FONT_000 = 'mem-font 0',
  UI_MEM_FONT_001 = 'mem-font 1',
  UI_MEM_FONT_002 = 'mem-font 2',
  UI_MEM_FONT_003 = 'mem-font 3',
  UI_MEM_FONT_004 = 'mem-font 4',
  UI_MEM_FONT_005 = 'mem-font 5',
  UI_MEM_FONT_006 = 'mem-font 6',
  UI_MEM_FONT_007 = 'mem-font 7',
  UI_MEM_FONT_008 = 'mem-font 8',
  UI_MEM_FONT_009 = 'mem-font 9',
  UI_MEM_FONT_010 = 'mem-font 10',
  UI_MEM_FONT_011 = 'mem-font 11',
  UI_MEM_FONT_012 = 'mem-font 12',
  UI_MEM_FONT_013 = 'mem-font 13',
  UI_MEM_FONT_014 = 'mem-font 14',
  UI_MEM_FONT_015 = 'mem-font 15',
  UI_MEM_FONT_016 = 'mem-font 16',
  UI_MEM_FONT_017 = 'mem-font 17',
  UI_MEM_FONT_018 = 'mem-font 18',
  UI_MEM_FONT_019 = 'mem-font 19',
  UI_MEM_FONT_020 = 'mem-font 20',
  UI_MEM_FONT_021 = 'mem-font 21',
  UI_MEM_FONT_022 = 'mem-font 22',
  UI_MEM_FONT_023 = 'mem-font 23',
  UI_MEM_FONT_024 = 'mem-font 24',
  UI_MEM_FONT_025 = 'mem-font 25',
  UI_MEM_FONT_026 = 'mem-font 26',
  UI_MEM_FONT_027 = 'mem-font 27',
  UI_MEM_FONT_028 = 'mem-font 28',
  UI_MEM_FONT_029 = 'mem-font 29',
  UI_MEM_FONT_030 = 'mem-font 30',
  UI_MEM_FONT_031 = 'mem-font 31',
  UI_MEM_FONT_032 = 'mem-font 32',
  UI_MEM_FONT_033 = 'mem-font 33',
  UI_MEM_FONT_034 = 'mem-font 34',
  UI_MEM_FONT_035 = 'mem-font 35',
  UI_MEM_FONT_036 = 'mem-font 36',
  UI_MEM_FONT_037 = 'mem-font 37',
  UI_MEM_FONT_038 = 'mem-font 38',
  UI_MEM_FONT_039 = 'mem-font 39',
  UI_MEM_FONT_040 = 'mem-font 40',
  UI_MEM_FONT_041 = 'mem-font 41',
  UI_MEM_FONT_042 = 'mem-font 42',
  UI_MEM_FONT_043 = 'mem-font 43',
  UI_MEM_FONT_044 = 'mem-font 44',
  UI_MEM_FONT_045 = 'mem-font 45',
  UI_MEM_FONT_046 = 'mem-font 46',
  UI_MEM_FONT_047 = 'mem-font 47',
  UI_MEM_FONT_048 = 'mem-font 48',
  UI_MEM_FONT_049 = 'mem-font 49',
  UI_MEM_FONT_050 = 'mem-font 50',
  UI_MEM_FONT_051 = 'mem-font 51',
  UI_MEM_FONT_052 = 'mem-font 52',
  UI_MEM_FONT_053 = 'mem-font 53',
  UI_MEM_FONT_054 = 'mem-font 54',
  UI_MEM_FONT_055 = 'mem-font 55',
  UI_MEM_FONT_056 = 'mem-font 56',
  UI_MEM_FONT_057 = 'mem-font 57',
  UI_MEM_FONT_058 = 'mem-font 58',
  UI_MEM_FONT_059 = 'mem-font 59',
  UI_MEM_FONT_060 = 'mem-font 60',
  UI_MEM_FONT_061 = 'mem-font 61',
  UI_MEM_FONT_062 = 'mem-font 62',
  UI_MEM_FONT_063 = 'mem-font 63',
  UI_MEM_FONT_064 = 'mem-font 64',
  UI_MEM_FONT_065 = 'mem-font 65',
  UI_MEM_FONT_066 = 'mem-font 66',
  UI_MEM_FONT_067 = 'mem-font 67',
  UI_MEM_FONT_068 = 'mem-font 68',
  UI_MEM_FONT_069 = 'mem-font 69',
  UI_MEM_FONT_070 = 'mem-font 70',
  UI_MEM_FONT_071 = 'mem-font 71',
  UI_MEM_FONT_072 = 'mem-font 72',
  UI_MEM_FONT_073 = 'mem-font 73',
  UI_MEM_FONT_074 = 'mem-font 74',
  UI_MEM_FONT_075 = 'mem-font 75',
  UI_MEM_FONT_076 = 'mem-font 76',
  UI_MEM_FONT_077 = 'mem-font 77',
  UI_MEM_FONT_078 = 'mem-font 78',
  UI_MEM_FONT_079 = 'mem-font 79',
  UI_MEM_FONT_080 = 'mem-font 80',
  UI_MEM_FONT_081 = 'mem-font 81',
  UI_MEM_FONT_082 = 'mem-font 82',
  UI_MEM_FONT_083 = 'mem-font 83',
  UI_MEM_FONT_084 = 'mem-font 84',
  UI_MEM_FONT_085 = 'mem-font 85',
  UI_MEM_FONT_086 = 'mem-font 86',
  UI_MEM_FONT_087 = 'mem-font 87',
  UI_MEM_FONT_088 = 'mem-font 88',
  UI_MEM_FONT_089 = 'mem-font 89',
  UI_MEM_FONT_090 = 'mem-font 90',
  UI_MEM_FONT_091 = 'mem-font 91',
  UI_MEM_FONT_092 = 'mem-font 92',
  UI_MEM_FONT_093 = 'mem-font 93',
  UI_MEM_FONT_094 = 'mem-font 94',
  UI_MEM_FONT_095 = 'mem-font 95',
  UI_MEM_FONT_096 = 'mem-font 96',
  UI_MEM_FONT_097 = 'mem-font 97',
  UI_MEM_FONT_098 = 'mem-font 98',
  UI_MEM_FONT_099 = 'mem-font 99',
  UI_MEM_FONT_100 = 'mem-font 100',
  UI_MEM_FONT_101 = 'mem-font 101',
  UI_MEM_FONT_102 = 'mem-font 102',
  UI_MEM_FONT_103 = 'mem-font 103',
  UI_MEM_FONT_104 = 'mem-font 104',
  UI_MEM_FONT_105 = 'mem-font 105',
  UI_MEM_FONT_106 = 'mem-font 106',
  UI_MEM_FONT_107 = 'mem-font 107',
  UI_MEM_FONT_108 = 'mem-font 108',
  UI_MEM_FONT_109 = 'mem-font 109',
  UI_MEM_FONT_110 = 'mem-font 110',
  UI_MEM_FONT_111 = 'mem-font 111',
  UI_MEM_FONT_112 = 'mem-font 112',
  UI_MEM_FONT_113 = 'mem-font 113',
  UI_MEM_FONT_114 = 'mem-font 114',
  UI_MEM_FONT_115 = 'mem-font 115',
  UI_MEM_FONT_116 = 'mem-font 116',
  UI_MEM_FONT_117 = 'mem-font 117',
  UI_MEM_FONT_118 = 'mem-font 118',
  UI_MEM_FONT_119 = 'mem-font 119',
  UI_MEM_FONT_120 = 'mem-font 120',
  UI_MEM_FONT_121 = 'mem-font 121',
  UI_MEM_FONT_122 = 'mem-font 122',
  UI_MEM_FONT_123 = 'mem-font 123',
  UI_MEM_FONT_124 = 'mem-font 124',
  UI_MEM_FONT_125 = 'mem-font 125',
  UI_MEM_FONT_126 = 'mem-font 126',
  UI_MEM_FONT_127 = 'mem-font 127',
  UI_PICK = 'ui pick',
  UI_SWITCH = 'ui-switch',
  UI_TINY_BACKPACKER = 'tiny-backpacker',
  UI_WINDOW_MODE_CHART = 'ui-window-mode-chart',
  UI_ZOOM_MULTIPLIER_CHART = 'ui-zoom-multiplier-chart'
}
