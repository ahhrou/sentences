(function () {
  const BOXES = [
    { k: 'who', en: 'Who?', zh: '人物', c: '#3b82f6' },
    { k: 'doing', en: 'Doing what?', zh: '动作', c: '#22a661' },
    { k: 'what', en: 'What?', zh: '物品', c: '#f2b01e', tc: '#4a3600' }
  ];

  /* Every sentence = Who + Doing what + What (+ Where + When). The picture matches the sentence. */
  const WORDS = {
    give: {
      word: 'give', ipa: '/ɡɪv/', pos: 'verb 动词', zh: '给', color: '#ef476f',
      sentences: [
        { who: 'The girl', doing: 'gives', what: 'a gift to her mom', where: 'at home', when: 'in the morning', zh: '女孩把礼物送给妈妈。', scene: 'give1' },
        { who: 'The boy', doing: 'gives', what: 'food to his dog', where: 'in the park', when: 'in the afternoon', zh: '男孩喂他的狗。', scene: 'give2' },
        { who: 'The teacher', doing: 'gives', what: 'a book to the boy', where: 'in the classroom', when: 'on Monday', zh: '老师把一本书给男孩。', scene: 'give3' }
      ]
    },
    speak: {
      word: 'speak', ipa: '/spiːk/', pos: 'verb 动词', zh: '说话；讲', color: '#3b82f6',
      sentences: [
        { who: 'The girl', doing: 'speaks', what: 'English', where: 'in the classroom', when: 'in the morning', zh: '女孩说英语。', scene: 'speak1' },
        { who: 'The woman', doing: 'speaks', what: 'to the people', where: 'on the stage', when: 'in the evening', zh: '女士对大家讲话。', scene: 'speak2' },
        { who: 'The boy', doing: 'speaks', what: 'to his grandma', where: 'at home', when: 'at night', zh: '男孩对奶奶说话。', scene: 'speak3' }
      ]
    },
    question: {
      word: 'question', ipa: '/ˈkwestʃən/', pos: 'noun 名词', zh: '问题', color: '#8b5cf6',
      sentences: [
        { who: 'The student', doing: 'asks', what: 'a question', where: 'in the classroom', when: 'in the morning', zh: '学生问了一个问题。', scene: 'question1' },
        { who: 'The boy', doing: 'asks', what: 'his dad a question', where: 'at home', when: 'in the evening', zh: '男孩问爸爸一个问题。', scene: 'question2' },
        { who: 'The girl', doing: 'asks', what: 'the librarian a question', where: 'in the library', when: 'in the afternoon', zh: '女孩问管理员一个问题。', scene: 'question3' }
      ]
    },
    battery: {
      word: 'battery', ipa: '/ˈbætəri/', pos: 'noun 名词', zh: '电池', color: '#f59e0b',
      sentences: [
        { who: 'The boy', doing: 'puts', what: 'a battery in the toy car', where: 'in his room', when: 'at night', zh: '男孩把电池装进玩具车。', scene: 'battery1' },
        { who: 'The dad', doing: 'changes', what: 'the battery in the clock', where: 'in the living room', when: 'on Sunday', zh: '爸爸换时钟的电池。', scene: 'battery2' },
        { who: 'The girl', doing: 'checks', what: 'the battery on her phone', where: 'at school', when: 'at noon', zh: '女孩查看手机的电量。', scene: 'battery3' }
      ]
    }
  };
  window.SEED_WORDS = WORDS;
})();
