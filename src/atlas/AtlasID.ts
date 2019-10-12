/** The Atlas.Animation identifier for all Animations in the Atlas. IDs are used
    to reference immutable image source properties, such as dimensions and
    animation duration, from the Atlas. The tag convention used here is
    <file stem>-<state>. */
export enum AtlasID {
  ARROW_DIAGONAL = 'arrow-upRight',
  ARROW_HORIZONTAL = 'arrow-right',
  ARROW_VERTICAL = 'arrow-up',
  BACKPACKER_IDLE_DOWN = 'backpacker-idleDown',
  BACKPACKER_IDLE_RIGHT = 'backpacker-idleRight',
  BACKPACKER_IDLE_UP = 'backpacker-idleUp',
  BACKPACKER_WALK_DOWN = 'backpacker-walkDown',
  BACKPACKER_WALK_RIGHT = 'backpacker-walkRight',
  BACKPACKER_WALK_RIGHT_SHADOW = 'backpacker-walkRightShadow',
  BACKPACKER_WALK_UP = 'backpacker-walkUp',
  BACKPACKER_WALK_VERTICAL_SHADOW = 'backpacker-walkUpDownShadow',
  BEE = 'bee',
  BEE_BLOOD = 'bee-blood',
  BEE_DEAD = 'bee-dead',
  BEE_SHADOW = 'bee-shadow',
  BIRD_FLY = 'bird-fly',
  BIRD_REST = 'bird-rest',
  BIRD_RISE = 'bird-rise',
  BUNNY = 'bunny',
  BUNNY_BLOOD = 'bunny-blood',
  BUNNY_DEAD = 'bunny-dead',
  BUNNY_SHADOW = 'bunny-shadow',
  FROG_EAT = 'frog-eat',
  FROG_IDLE = 'frog-idle',
  FROG_IDLE_SHADOW = 'frog-idleShadow',
  FROG_LEAP = 'frog-leap',
  PIG = 'pig',
  SNAKE = 'snake',
  SNAKE_SHADOW = 'snake-shadow',
  BUSH = 'bush',
  BUSH_SHADOW = 'bush-shadow',
  CATTAILS = 'cattails',
  CLOUD_MEDIUM = 'cloud-medium',
  CLOUD_MEDIUM_SHADOW = 'cloud-mediumShadow',
  CLOUD_LARGE = 'cloud-large',
  CLOUD_LARGE_SHADOW = 'cloud-largeShadow',
  CLOUD_RAIN_PUDDLE = 'cloudRain-puddle',
  CLOUD_RAIN = 'cloudRain',
  CLOUD_RAIN_SPLASH = 'cloudRainSplash',
  CLOUD_RAIN_SPRINKLE = 'cloudRain-sprinkle',
  CLOVER_0x0 = 'clover-0x0',
  CLOVER_0x1 = 'clover-0x1',
  CLOVER_0x2 = 'clover-0x2',
  CLOVER_0x3 = 'clover-0x3',
  CLOVER_0x4 = 'clover-0x4',
  CLOVER_1x0 = 'clover-1x0',
  CLOVER_1x1 = 'clover-1x1',
  CLOVER_1x2 = 'clover-1x2',
  CLOVER_1x3 = 'clover-1x3',
  CLOVER_1x4 = 'clover-1x4',
  CONIFER = 'conifer',
  CONIFER_SHADOW = 'conifer-shadow',
  FLAG = 'flag',
  FLAG_SHADOW = 'flag-shadow',
  GRASS_00 = 'grass-00',
  GRASS_01 = 'grass-01',
  GRASS_02 = 'grass-02',
  GRASS_03 = 'grass-03',
  GRASS_04 = 'grass-04',
  GRASS_05 = 'grass-05',
  GRASS_06 = 'grass-06',
  GRASS_07 = 'grass-07',
  GRASS_08 = 'grass-08',
  GRASS_09 = 'grass-09',
  GRASS_10 = 'grass-10',
  GRASS_11 = 'grass-11',
  GRASS_12 = 'grass-12',
  GRASS_13 = 'grass-13',
  GRASS_14 = 'grass-14',
  GRASS_15 = 'grass-15',
  MOUNTAIN = 'mountain',
  MOUNTAIN_SHADOW = 'mountain-shadow',
  PATH_CORNER_E = 'path->',
  PATH_CORNER_N = 'path-^',
  PATH_NE = 'path-/',
  POND = 'pond',
  SUBSHRUB = 'subshrub',
  SUBSHRUB_SHADOW = 'subshrub-shadow',
  TREE = 'tree',
  TREE_SHADOW = 'tree-shadow',
  MEM_FONT_000 = 'memFont-000',
  MEM_FONT_001 = 'memFont-001',
  MEM_FONT_002 = 'memFont-002',
  MEM_FONT_003 = 'memFont-003',
  MEM_FONT_004 = 'memFont-004',
  MEM_FONT_005 = 'memFont-005',
  MEM_FONT_006 = 'memFont-006',
  MEM_FONT_007 = 'memFont-007',
  MEM_FONT_008 = 'memFont-008',
  MEM_FONT_009 = 'memFont-009',
  MEM_FONT_010 = 'memFont-010',
  MEM_FONT_011 = 'memFont-011',
  MEM_FONT_012 = 'memFont-012',
  MEM_FONT_013 = 'memFont-013',
  MEM_FONT_014 = 'memFont-014',
  MEM_FONT_015 = 'memFont-015',
  MEM_FONT_016 = 'memFont-016',
  MEM_FONT_017 = 'memFont-017',
  MEM_FONT_018 = 'memFont-018',
  MEM_FONT_019 = 'memFont-019',
  MEM_FONT_020 = 'memFont-020',
  MEM_FONT_021 = 'memFont-021',
  MEM_FONT_022 = 'memFont-022',
  MEM_FONT_023 = 'memFont-023',
  MEM_FONT_024 = 'memFont-024',
  MEM_FONT_025 = 'memFont-025',
  MEM_FONT_026 = 'memFont-026',
  MEM_FONT_027 = 'memFont-027',
  MEM_FONT_028 = 'memFont-028',
  MEM_FONT_029 = 'memFont-029',
  MEM_FONT_030 = 'memFont-030',
  MEM_FONT_031 = 'memFont-031',
  MEM_FONT_032 = 'memFont-032',
  MEM_FONT_033 = 'memFont-033',
  MEM_FONT_034 = 'memFont-034',
  MEM_FONT_035 = 'memFont-035',
  MEM_FONT_036 = 'memFont-036',
  MEM_FONT_037 = 'memFont-037',
  MEM_FONT_038 = 'memFont-038',
  MEM_FONT_039 = 'memFont-039',
  MEM_FONT_040 = 'memFont-040',
  MEM_FONT_041 = 'memFont-041',
  MEM_FONT_042 = 'memFont-042',
  MEM_FONT_043 = 'memFont-043',
  MEM_FONT_044 = 'memFont-044',
  MEM_FONT_045 = 'memFont-045',
  MEM_FONT_046 = 'memFont-046',
  MEM_FONT_047 = 'memFont-047',
  MEM_FONT_048 = 'memFont-048',
  MEM_FONT_049 = 'memFont-049',
  MEM_FONT_050 = 'memFont-050',
  MEM_FONT_051 = 'memFont-051',
  MEM_FONT_052 = 'memFont-052',
  MEM_FONT_053 = 'memFont-053',
  MEM_FONT_054 = 'memFont-054',
  MEM_FONT_055 = 'memFont-055',
  MEM_FONT_056 = 'memFont-056',
  MEM_FONT_057 = 'memFont-057',
  MEM_FONT_058 = 'memFont-058',
  MEM_FONT_059 = 'memFont-059',
  MEM_FONT_060 = 'memFont-060',
  MEM_FONT_061 = 'memFont-061',
  MEM_FONT_062 = 'memFont-062',
  MEM_FONT_063 = 'memFont-063',
  MEM_FONT_064 = 'memFont-064',
  MEM_FONT_065 = 'memFont-065',
  MEM_FONT_066 = 'memFont-066',
  MEM_FONT_067 = 'memFont-067',
  MEM_FONT_068 = 'memFont-068',
  MEM_FONT_069 = 'memFont-069',
  MEM_FONT_070 = 'memFont-070',
  MEM_FONT_071 = 'memFont-071',
  MEM_FONT_072 = 'memFont-072',
  MEM_FONT_073 = 'memFont-073',
  MEM_FONT_074 = 'memFont-074',
  MEM_FONT_075 = 'memFont-075',
  MEM_FONT_076 = 'memFont-076',
  MEM_FONT_077 = 'memFont-077',
  MEM_FONT_078 = 'memFont-078',
  MEM_FONT_079 = 'memFont-079',
  MEM_FONT_080 = 'memFont-080',
  MEM_FONT_081 = 'memFont-081',
  MEM_FONT_082 = 'memFont-082',
  MEM_FONT_083 = 'memFont-083',
  MEM_FONT_084 = 'memFont-084',
  MEM_FONT_085 = 'memFont-085',
  MEM_FONT_086 = 'memFont-086',
  MEM_FONT_087 = 'memFont-087',
  MEM_FONT_088 = 'memFont-088',
  MEM_FONT_089 = 'memFont-089',
  MEM_FONT_090 = 'memFont-090',
  MEM_FONT_091 = 'memFont-091',
  MEM_FONT_092 = 'memFont-092',
  MEM_FONT_093 = 'memFont-093',
  MEM_FONT_094 = 'memFont-094',
  MEM_FONT_095 = 'memFont-095',
  MEM_FONT_096 = 'memFont-096',
  MEM_FONT_097 = 'memFont-097',
  MEM_FONT_098 = 'memFont-098',
  MEM_FONT_099 = 'memFont-099',
  MEM_FONT_100 = 'memFont-100',
  MEM_FONT_101 = 'memFont-101',
  MEM_FONT_102 = 'memFont-102',
  MEM_FONT_103 = 'memFont-103',
  MEM_FONT_104 = 'memFont-104',
  MEM_FONT_105 = 'memFont-105',
  MEM_FONT_106 = 'memFont-106',
  MEM_FONT_107 = 'memFont-107',
  MEM_FONT_108 = 'memFont-108',
  MEM_FONT_109 = 'memFont-109',
  MEM_FONT_110 = 'memFont-110',
  MEM_FONT_111 = 'memFont-111',
  MEM_FONT_112 = 'memFont-112',
  MEM_FONT_113 = 'memFont-113',
  MEM_FONT_114 = 'memFont-114',
  MEM_FONT_115 = 'memFont-115',
  MEM_FONT_116 = 'memFont-116',
  MEM_FONT_117 = 'memFont-117',
  MEM_FONT_118 = 'memFont-118',
  MEM_FONT_119 = 'memFont-119',
  MEM_FONT_120 = 'memFont-120',
  MEM_FONT_121 = 'memFont-121',
  MEM_FONT_122 = 'memFont-122',
  MEM_FONT_123 = 'memFont-123',
  MEM_FONT_124 = 'memFont-124',
  MEM_FONT_125 = 'memFont-125',
  MEM_FONT_126 = 'memFont-126',
  MEM_FONT_127 = 'memFont-127',
  ODDOID = 'oddoid',
  PALETTE_BLACK = 'palette-black',
  PALETTE_BLUE = 'palette-blue',
  PALETTE_DARK_GREEN = 'palette-darkGreen',
  PALETTE_GREEN = 'palette-green',
  PALETTE_GREY = 'palette-grey',
  PALETTE_LIGHT_BLUE = 'palette-lightBlue',
  PALETTE_LIGHT_GREEN = 'palette-lightGreen',
  PALETTE_LIGHT_GREY = 'palette-lightGrey',
  PALETTE_ORANGE = 'palette-orange',
  PALETTE_PALE_GREEN = 'palette-paleGreen',
  PALETTE_RED = 'palette-red',
  PALETTE_TRANSPARENT = 'palette-transparent',
  PALETTE_WHITE = 'palette-white',
  UI_BUTTON_BASE = 'uiButton-base',
  UI_BUTTON_CREATE = 'uiButton-create',
  UI_BUTTON_DECREMENT = 'uiButton-decrement',
  UI_BUTTON_DESTROY = 'uiButton-destroy',
  UI_BUTTON_INCREMENT = 'uiButton-increment',
  UI_BUTTON_MENU = 'uiButton-menu',
  UI_BUTTON_PRESSED = 'uiButton-pressed',
  UI_BUTTON_TOGGLE_GRID = 'uiButton-toggleGrid',
  UI_CHECKERBOARD_BLACK_TRANSPARENT = 'uiCheckerboard-blackTransparent',
  UI_CHECKERBOARD_BLACK_WHITE = 'uiCheckerboard-blackWhite',
  UI_CHECKERBOARD_BLUE_GREY = 'uiCheckerboard-blueGrey',
  UI_DESTINATION_MARKER = 'uiDestinationMarker',
  UI_GRID = 'uiGrid',
  UI_SWITCH = 'uiSwitch',
  UI_WINDOW_MODE_CHART = 'uiWindowModeChart',
  UI_ZOOM_MULTIPLIER_CHART = 'uiZoomMultiplierChart'
}

export const MEM_FONT_PREFIX = 'memFont-'
