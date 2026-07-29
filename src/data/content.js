const p = (name) => `/photos/${name}`

export const site = {
  collegeName: 'Techno International New Town',
  collegeShort: 'TINT',
  department: 'Computer Science & Engineering',
  batchLabel: 'CSE Batch of 2022–2026',
  batchYear: '2026',
  tagline: 'We came here as strangers. We leave as a story.',
  finaleLine1: 'This is not goodbye. This is just the end of our first chapter.',
  finaleLine2: 'Wherever life takes us, a part of us will always be here.',
  bestOfLuckTitle: 'Best of luck for the future',
  bestOfLuckLine:
    'May every door ahead open with the same courage we found together — and may TINT CSE always walk with you.',
  secretCode: 'chai break',
  secretMessage:
    'Remember the signed shirts, the project folders, and the last walk across campus? That was the day we stopped being classmates and became a forever story.',
}

export const navigation = [
  { id: 'home', label: 'Home' },
  { id: 'story', label: 'Our Story' },
  { id: 'memories', label: 'Memories' },
  { id: 'hall', label: 'AR Hall' },
  { id: 'creators', label: 'Creators' },
  { id: 'the-end', label: 'The End' },
  { id: 'best-of-luck', label: 'Best of Luck' },
]

/** Farewell soundtrack — files in /public/audio */
export const playlist = [
  { id: 'kabira', title: 'Kabira', src: '/audio/kabira.mp3' },
  { id: 'iktara', title: 'Iktara', src: '/audio/iktara.mp3' },
  { id: 'ilahi', title: 'Ilahi', src: '/audio/ilahi.mp3' },
  { id: 'tera-yaar', title: 'Tera Yaar Hoon Main', src: '/audio/tera-yaar-hoon-main.mp3' },
  { id: 'yaaron', title: 'Yaaron', src: '/audio/yaaron.mp3' },
  { id: 'woh-din', title: 'Woh Din', src: '/audio/woh-din.mp3' },
  { id: 'behti-hawa', title: 'Behti Hawa Sa Tha Woh', src: '/audio/behti-hawa.mp3' },
  { id: 'khaabon', title: 'Khaabon Ke Parinday', src: '/audio/khaabon-ke-parinday.mp3' },
]

export const creators = [
  {
    id: 'piyush',
    name: 'Piyush Goenka',
    role: 'Creator',
    photo: p('friend-piyush.jpg'),
    bio: 'Co-creator of this digital time capsule — crafting the story, the frames, and the farewell feeling for TINT CSE 2026.',
  },
  {
    id: 'sorbojit',
    name: 'Sorbojit Mondal',
    role: 'Creator',
    photo: p('friend-sorbojit.jpg'),
    bio: 'Co-creator of this living yearbook — building the experience so every friend can revisit these years, anytime.',
  },
]

export const chapters = [
  {
    id: 'year-1',
    year: 'Year 1',
    title: 'The Beginning',
    subtitle: 'Nervous hellos, wrong classrooms, and the first shared laugh.',
    body: 'We walked into TINT as strangers in blue shirts. Orientation felt endless. Within weeks, corridors became shortcuts to friendship — and CSE started feeling like home.',
    photos: [
      { id: 'y1-1', src: p('wa-lab-desk.jpg'), caption: 'Blue desks, blue lanyards, brand new friendships.', tags: ['first-year', 'candid'], year: '1', location: 'classroom' },
      { id: 'y1-2', src: p('wa-classroom-uno.jpg'), caption: 'UNO between lectures. Peak first-year chaos.', tags: ['first-year', 'chaos'], year: '1', polaroid: true, rotate: -3, location: 'classroom' },
      { id: 'y1-3', src: p('wa-pointing-crowd.jpg'), caption: 'Everyone pointing at the camera. Obviously.', tags: ['first-year', 'friends'], year: '1' },
    ],
  },
  {
    id: 'year-2',
    year: 'Year 2',
    title: 'We Found Our People',
    subtitle: 'Inside jokes formed. Group chats never slept. The batch became a constellation.',
    body: 'Second year was when the roster turned into a family. Selfies between classes, shared projects, and the quiet certainty that these people would matter forever.',
    photos: [
      { id: 'y2-1', src: p('wa-holi.jpg'), caption: 'Holi colors. Forever friendship.', tags: ['college-fest', 'friends'], year: '2' },
      { id: 'y2-2', src: p('wa-grass-hangout.jpg'), caption: 'Lawn hangouts that felt like forever.', tags: ['friends', 'candid'], year: '2', polaroid: true, rotate: 2 },
      { id: 'y2-3', src: p('wa-seven-friends.jpg'), caption: 'Seven friends. Golden hour. Soft light.', tags: ['friends', 'trips'], year: '2' },
    ],
  },
  {
    id: 'year-3',
    year: 'Year 3',
    title: 'The Chaos',
    subtitle: 'Deadlines, bunks, projects, heartbreaks — and the best stories.',
    body: 'Third year asked everything of us. Labs, submissions, late nights. Somehow we still found time for group chaos and corridor laughter.',
    photos: [
      { id: 'y3-1', src: p('wa-seminar-batch.jpg'), caption: 'Seminar hall. Matching polos. Shared pride.', tags: ['friends', 'faculty'], year: '3', location: 'auditorium' },
      { id: 'y3-2', src: p('wa-trip-group.jpg'), caption: 'The trip that became a core memory.', tags: ['trips', 'friends'], year: '3', polaroid: true, rotate: -2 },
      { id: 'y3-3', src: p('wa-fest-selfie.jpg'), caption: 'Fest day. Crowd behind. Us in the frame.', tags: ['college-fest', 'chaos'], year: '3' },
    ],
  },
  {
    id: 'year-4',
    year: 'Year 4',
    title: 'The Last Chapter',
    subtitle: 'Final projects, farewell poses, and holding on a little tighter.',
    body: 'We counted remaining Mondays. Group photos got longer. Every ordinary walk across TINT felt borrowed.',
    photos: [
      { id: 'y4-1', src: p('batch-uniform.jpg'), caption: 'The class that became a family.', tags: ['farewell', 'friends'], year: '4' },
      { id: 'y4-2', src: p('cse-wall-group.jpg'), caption: 'Department of CSE — our wall, our people.', tags: ['farewell', 'friends'], year: '4', polaroid: true, rotate: 3, location: 'auditorium' },
      { id: 'y4-3', src: p('batch-mega.jpg'), caption: 'The whole batch — one frame, forever.', tags: ['farewell', 'friends'], year: '4' },
    ],
  },
]

export const gallery = [
  { id: 'g1', src: p('batch-mega.jpg'), caption: 'The whole batch — one frame, forever.', tags: ['friends', 'farewell'], year: '4' },
  { id: 'g2', src: p('batch-uniform.jpg'), caption: 'Blue shirts. Bright futures.', tags: ['farewell', 'friends'], year: '4' },
  { id: 'g3', src: p('batch-outdoor.jpg'), caption: 'Outdoor batch energy.', tags: ['friends', 'college-fest'], year: '3' },
  { id: 'g4', src: p('batch-smile.jpg'), caption: 'Smile for the years we survived.', tags: ['friends', 'candid'], year: '3' },
  { id: 'g5', src: p('cse-wall-group.jpg'), caption: 'Department of CSE — our wall, our people.', tags: ['friends', 'faculty'], year: '4', location: 'auditorium' },
  { id: 'g6', src: p('squad-four.jpg'), caption: 'The core four. Thumbs up forever.', tags: ['friends', 'candid'], year: '4' },
  { id: 'g7', src: p('trio-campus.jpg'), caption: 'Three against the world (and midterms).', tags: ['friends', 'candid'], year: '4' },
  { id: 'g8', src: p('hallway-friends.jpg'), caption: 'Yellow corridor. Golden friendship.', tags: ['friends', 'candid'], year: '4', location: 'classroom' },
  { id: 'g9', src: p('selfie-five.jpg'), caption: 'The inner circle, captured mid-laugh.', tags: ['friends', 'candid'], year: '3' },
  { id: 'g10', src: p('casual-five.jpg'), caption: 'No uniforms required for belonging.', tags: ['friends', 'trips'], year: '3' },
  { id: 'g11', src: p('selfie-trio.jpg'), caption: 'Classic campus selfie.', tags: ['friends', 'first-year'], year: '2', polaroid: true, rotate: 1 },
  { id: 'g12', src: p('farewell-crowd.jpg'), caption: 'Five friends. One last campus pose.', tags: ['farewell', 'friends'], year: '4' },
  { id: 'g13', src: p('friends-plaza.jpg'), caption: 'Plaza light. Perfect timing.', tags: ['friends', 'candid'], year: '4' },
  { id: 'g14', src: p('campus-day.jpg'), caption: 'Court side. Batch wide.', tags: ['friends', 'candid'], year: '2', location: 'playground' },
  { id: 'g15', src: p('early-farewell.jpg'), caption: 'Classroom chaos, camera ready.', tags: ['friends', 'chaos'], year: '4', location: 'classroom', polaroid: true, rotate: -2 },
  { id: 'g16', src: p('wa-trip-group.jpg'), caption: 'Outing day — the whole crew assembled.', tags: ['trips', 'friends'], year: '3' },
  { id: 'g17', src: p('wa-college-hall.jpg'), caption: 'College hall. Matching shirts. Matching smiles.', tags: ['friends', 'faculty'], year: '3' },
  { id: 'g18', src: p('wa-polo-wefie.jpg'), caption: 'Wefie after rain. Polo squad forever.', tags: ['friends', 'candid'], year: '2' },
  { id: 'g19', src: p('wa-event-crowd.jpg'), caption: 'Event day chaos — and we loved it.', tags: ['college-fest', 'friends'], year: '3' },
  { id: 'g20', src: p('wa-girls-talk.jpg'), caption: 'Sidewalk stories that never made the syllabus.', tags: ['friends', 'candid'], year: '3' },
  { id: 'g21', src: p('wa-seven-friends.jpg'), caption: 'Seven friends under soft evening light.', tags: ['friends', 'trips'], year: '2' },
  { id: 'g22', src: p('wa-lawn-selfie.jpg'), caption: 'Lawn selfie. Peace signs mandatory.', tags: ['friends', 'candid'], year: '2', polaroid: true, rotate: -2 },
  { id: 'g23', src: p('wa-lakeside-trio.jpg'), caption: 'Lakeside laughter and matching polos.', tags: ['friends', 'trips'], year: '2' },
  { id: 'g24', src: p('wa-grass-hangout.jpg'), caption: 'March afternoon on the grass.', tags: ['friends', 'candid'], year: '2' },
  { id: 'g25', src: p('wa-cse-selfie.jpg'), caption: 'CSE glass wall selfie — department pride.', tags: ['friends', 'faculty'], year: '3', location: 'auditorium' },
  { id: 'g26', src: p('wa-holi.jpg'), caption: 'Holi — colors, chaos, family.', tags: ['college-fest', 'chaos'], year: '2', polaroid: true, rotate: 2 },
  { id: 'g27', src: p('wa-campus-lawn.jpg'), caption: 'Usual spot. Unusual joy.', tags: ['friends', 'candid'], year: '3' },
  { id: 'g28', src: p('wa-classroom-uno.jpg'), caption: 'Classroom UNO — unofficial elective.', tags: ['chaos', 'candid'], year: '1', location: 'classroom' },
  { id: 'g29', src: p('wa-uno-table.jpg'), caption: 'Hands on the table. Cards in play.', tags: ['chaos', 'friends'], year: '1' },
  { id: 'g30', src: p('wa-pointing-crowd.jpg'), caption: 'Point at the camera. Capture the bond.', tags: ['friends', 'candid'], year: '2' },
  { id: 'g31', src: p('wa-seminar-batch.jpg'), caption: 'Seminar hall batch portrait.', tags: ['friends', 'faculty'], year: '3', location: 'auditorium' },
  { id: 'g32', src: p('wa-auditorium.jpg'), caption: 'Auditorium seats. Peace signs. Present.', tags: ['college-fest', 'friends'], year: '3', location: 'auditorium' },
  { id: 'g33', src: p('wa-fest-selfie.jpg'), caption: 'Fest crowd selfie energy.', tags: ['college-fest', 'chaos'], year: '3' },
  { id: 'g34', src: p('wa-lab-desk.jpg'), caption: 'Lab desk lineup after class.', tags: ['first-year', 'friends'], year: '1', location: 'classroom' },
]

export const galleryFilters = [
  { id: 'all', label: 'All Memories' },
  { id: 'first-year', label: 'First Year' },
  { id: 'trips', label: 'Trips' },
  { id: 'college-fest', label: 'College Fest' },
  { id: 'friends', label: 'Friends' },
  { id: 'chaos', label: 'Chaos' },
  { id: 'candid', label: 'Candid' },
  { id: 'farewell', label: 'Farewell' },
]

export const stats = [
  { id: 'years', label: 'Years Together', value: 4, suffix: '' },
  { id: 'semesters', label: 'Semesters Survived', value: 8, suffix: '' },
  { id: 'assignments', label: 'Assignments Submitted', value: 247, suffix: '+' },
  { id: 'exams', label: 'Exams Conquered', value: 64, suffix: '' },
  { id: 'chai', label: 'Chai Cups Shared', value: 1832, suffix: '+' },
  { id: 'photos', label: 'Group Photos Taken', value: 892, suffix: '+' },
  { id: 'bunks', label: 'Classes Bunked', value: 118, suffix: '*' },
  { id: 'fests', label: 'Festivals Attended', value: 16, suffix: '' },
  { id: 'memories', label: 'Memories Created', value: 10000, suffix: '+' },
]

/** Unofficial honors — the 6 Class Representatives of CSE */
export const awards = [
  {
    id: 'cr-piyush',
    section: 'CSE1',
    tenure: 'Class Representative',
    name: 'Piyush Goenka',
    photo: p('crs/cr-piyush.jpg'),
    description:
      'Carried CSE1’s voice with calm confidence — deadlines, doubts, and department drama included.',
  },
  {
    id: 'cr-sagarika',
    section: 'CSE1',
    tenure: 'Class Representative',
    name: 'Sagarika Sarkar',
    photo: p('crs/cr-sagarika.jpg'),
    description:
      'Made every notice feel personal and every problem feel shared. CSE1’s steady bridge.',
  },
  {
    id: 'cr-arya',
    section: 'CSE2',
    tenure: 'Class Representative',
    name: 'Arya Mukherjee',
    photo: p('crs/cr-arya.jpg'),
    description:
      'Handled Year II chaos like a plan — so the batch could keep moving forward together.',
  },
  {
    id: 'cr-shreya',
    section: 'CSE2',
    tenure: 'Class Representative',
    name: 'Shreya Mohanty',
    photo: p('crs/cr-shreya.jpg'),
    description:
      'Turned group panic into plans. Quiet leadership, loud results for CSE2.',
  },
  {
    id: 'cr-anuska',
    section: 'CSE3',
    tenure: 'Class Representative',
    name: 'Anuska Ghosh',
    photo: p('crs/cr-anushka.jpg'),
    description:
      'Protected the spirit of the batch through the hardest years — with grace and grit.',
  },
  {
    id: 'cr-yuvraj',
    section: 'CSE3',
    tenure: 'Class Representative',
    name: 'Yuvraj Prasad',
    photo: p('crs/cr-yuvraj.jpg'),
    description:
      'Stood between us and the storm — projects, placements, farewells — and never dropped the baton.',
  },
]

export const friends = [
  {
    id: 'f1',
    name: 'Squad Four',
    nickname: 'Thumbs Up',
    photo: p('squad-four.jpg'),
    personality: 'The unit that never needed a plan — only each other.',
    dialogue: '"Thumbs up if we survived."',
    funniest: 'Perfect formation every single time somehow.',
    message: 'Four people. Infinite stories. Still counting.',
  },
  {
    id: 'f2',
    name: 'Hallway Heroes',
    nickname: 'Yellow Corridor',
    photo: p('hallway-friends.jpg'),
    personality: 'Five hearts, one hallway, endless laughter.',
    dialogue: '"Group photo — now or never."',
    funniest: 'Turned a random corridor into a runway of friendship.',
    message: 'May every hallway ahead feel as warm as this one.',
  },
  {
    id: 'f3',
    name: 'Plaza Crew',
    nickname: 'The Seven',
    photo: p('friends-plaza.jpg'),
    personality: 'Namaste energy. Campus legends.',
    dialogue: '"One more on the checkered grass."',
    funniest: 'Made the plaza look like a yearbook cover every time.',
    message: 'Seven smiles. One forever memory.',
  },
  {
    id: 'f4',
    name: 'CSE Wall Squad',
    nickname: 'Department Pride',
    photo: p('cse-wall-group.jpg'),
    personality: 'Bound by blue shirts and bigger dreams.',
    dialogue: '"Stand under the CSE letters."',
    funniest: 'Looked official. Felt chaotic. Perfect combo.',
    message: 'Proud of where we stood — and who we stood with.',
  },
  {
    id: 'f5',
    name: 'Casual Five',
    nickname: 'Off-Duty Batch',
    photo: p('casual-five.jpg'),
    personality: 'No uniforms required for belonging.',
    dialogue: '"Selfie angle — higher!"',
    funniest: 'Proved friendship looks good in any outfit.',
    message: 'Keep the group chat alive. Always.',
  },
  {
    id: 'f6',
    name: 'Farewell Five',
    nickname: 'Last Pose',
    photo: p('farewell-crowd.jpg'),
    personality: 'The goodbye that refused to be quiet.',
    dialogue: '"Arms in. Smile bigger."',
    funniest: 'Took twenty takes. Kept every one.',
    message: 'This was never just a photo. It was a promise.',
  },
  {
    id: 'f7',
    name: 'Court Collective',
    nickname: 'Campus Day',
    photo: p('campus-day.jpg'),
    personality: 'The whole vibe of a regular extraordinary day.',
    dialogue: '"Everyone squeeze in!"',
    funniest: 'Someone always blinked. Nobody cared.',
    message: 'Ordinary days with you were the best chapters.',
  },
  {
    id: 'f8',
    name: 'The Full Batch',
    nickname: 'TINT CSE',
    photo: p('batch-uniform.jpg'),
    personality: 'Not a roster — a constellation.',
    dialogue: '"One last class photo."',
    funniest: 'The photographer yelled freeze. We laughed anyway.',
    message: 'Wherever we go, a part of us stays here.',
  },
]

export const mapLocations = [
  {
    id: 'classroom',
    name: 'Classroom',
    x: 28,
    y: 38,
    story: 'Where attendance was fiction and friendships were fact.',
    photos: ['g15', 'g8'],
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    x: 62,
    y: 32,
    story: 'Experiments failed. Bonds solidified.',
    photos: ['g7', 'g9'],
  },
  {
    id: 'library',
    name: 'Library',
    x: 45,
    y: 58,
    story: 'Whispers, deadlines, and shared panic before submissions.',
    photos: ['g5', 'g11'],
  },
  {
    id: 'canteen',
    name: 'Canteen',
    x: 72,
    y: 55,
    story: 'The unofficial parliament of the batch.',
    photos: ['g13', 'g12'],
  },
  {
    id: 'playground',
    name: 'Playground',
    x: 35,
    y: 72,
    story: 'Court lines, candid poses, campus air.',
    photos: ['g14', 'g3'],
  },
  {
    id: 'auditorium',
    name: 'Auditorium',
    x: 55,
    y: 22,
    story: 'Department wall moments and proud CSE milestones.',
    photos: ['g5', 'g2'],
  },
  {
    id: 'hostel',
    name: 'Campus Walk',
    x: 18,
    y: 55,
    story: 'Every path between buildings held a story.',
    photos: ['g1', 'g4'],
  },
]

export const faculty = [
  {
    id: 'fac1',
    name: 'CSE Faculty',
    role: 'Department of Computer Science & Engineering',
    photo: p('cse-wall-group.jpg'),
    note: 'Thank you for believing in us before we believed in ourselves — for every review, every deadline extension negotiated with grace, and every push that made us better engineers.',
  },
  {
    id: 'fac2',
    name: 'Our Mentors',
    role: 'Guides through eight semesters',
    photo: p('batch-uniform.jpg'),
    note: 'You made complex ideas feel approachable and hard days feel possible. We carry your lessons beyond TINT.',
  },
  {
    id: 'fac3',
    name: 'Project Coordinators',
    role: 'Final year & beyond',
    photo: p('batch-smile.jpg'),
    note: 'For every late-night review, honest critique, and quiet encouragement — thank you for shaping who we became.',
  },
  {
    id: 'fac4',
    name: 'Techno International New Town',
    role: 'Home for four years',
    photo: p('batch-mega.jpg'),
    note: 'These buildings held our chaos, our growth, and our friendships. A part of us will always be here.',
  },
]

export const video = {
  title: 'Our Farewell Film',
  subtitle: 'Four years at TINT CSE. One reel. Press play when you are ready.',
  embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0',
  poster: p('batch-mega.jpg'),
}

export const easterEggs = {
  logoPhoto: p('secret-class.jpg'),
  logoCaption: 'The secret batch photo — found only by the curious.',
  audioClipNote: 'A familiar laugh from farewell day, preserved forever.',
}

export const finalePhotos = [
  gallery.find((g) => g.id === 'g26'),
  gallery.find((g) => g.id === 'g16'),
  gallery.find((g) => g.id === 'g21'),
  gallery.find((g) => g.id === 'g18'),
  gallery.find((g) => g.id === 'g8'),
  gallery.find((g) => g.id === 'g13'),
  gallery.find((g) => g.id === 'g25'),
  gallery.find((g) => g.id === 'g31'),
  gallery.find((g) => g.id === 'g6'),
  gallery.find((g) => g.id === 'g28'),
  gallery.find((g) => g.id === 'g4'),
  gallery.find((g) => g.id === 'g2'),
].filter(Boolean)

export const heroImage = p('batch-mega.jpg')
export const finaleGroupImage = p('finale-group.jpg')
