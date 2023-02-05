import {Router} from 'express'
import { auth } from '../../middlwear/auth.js'
import * as cc from './controller/comment.js'
import * as validators from './comment.validate.js'
import { validation } from '../../middlwear/validation.js'
const router = Router()
router.get('/:id',validation(validators.IdAndAuth),auth(),cc.findOneComment)
router.post('/:id',validation(validators.addOrEiditComment),auth(),cc.addComment)
// router.patch('replay/:id',auth(),cc.replay)
router.put('/:id',validation(validators.addOrEiditComment),auth(),cc.EiditComment)
router.patch('/:id',validation(validators.IdAndAuth),auth(),cc.softDeleteComment)
router.patch('/:id/like',validation(validators.IdAndAuth),auth(),cc.likeComment)
export default router
