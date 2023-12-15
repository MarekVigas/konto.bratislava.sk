import { schema } from '../generator/functions'
import step1 from './priznanieKDaniZNehnutelnosti/step1'
import step2 from './priznanieKDaniZNehnutelnosti/step2'
import step3 from './priznanieKDaniZNehnutelnosti/step3'
import step4 from './priznanieKDaniZNehnutelnosti/step4'
import step5 from './priznanieKDaniZNehnutelnosti/step5'
import step6 from './priznanieKDaniZNehnutelnosti/step6'
import step7 from './priznanieKDaniZNehnutelnosti/step7'
import step8 from './priznanieKDaniZNehnutelnosti/step8'

export default schema(
  {
    title: 'Priznanie k dani z nehnuteľností',
    pospID: 'esmao.eforms.bratislava.obec_024',
    pospVersion: '201501.2',
  },
  {},
  [step1, step2, step3, step4, step5, step6, step7, step8],
)
