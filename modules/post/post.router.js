import {Router} from 'express'
import {auth} from '../../middlwear/auth.js'
import { validation } from '../../middlwear/validation.js'
import { HME, multerValidation, myMulter } from '../../service/clodMulter.js'
import * as pc from './controller/post.js'
import * as validators from './post.validate.js'
const router = Router()
router.get('/',validation(validators.getAllPosts),pc.getAllPosts)
router.get('/:id',validation(validators.getSpecificPosts),pc.getSpecificPosts)
router.post('/',validation(validators.addPost),auth(),myMulter(multerValidation.image).array('files',3), HME , pc.addPost)
router.put('/:id',validation(validators.updatePost),auth(),myMulter(multerValidation.image).array('files',3), HME , pc.updatePost)
router.delete('/:id',validation(validators.IdAndAuth),auth(),pc.deletePost)
router.patch('/:id/like',validation(validators.IdAndAuth),auth() , pc.likePost)
router.patch('/:id/unlike',validation(validators.IdAndAuth),auth() , pc.unlikePost)
export default router