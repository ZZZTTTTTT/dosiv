import Cookies from 'js-cookie'

const TokenKey = 'User-Token'
const UserIdKey = 'User-Id'
const RolesKey = 'User-Roles'
const UsernameKey = 'User-Name'
const RefreshTokenKey = 'User-Refresh-Token'
const LoginNameKey = 'Login-Name'
const DosUserInfoKey = 'dosUserInfo'
const DdsUserInfoKey = 'ddsUserInfo'
const originKey = 'origin'
const diagnoseDeviceCodeKey = 'diagnoseDeviceCode'
const currentNodeIdKey = 'currentNodeId'
const currentNodeLevelKey = 'currentNodeLevel'
const menuKey = 'menu'

export function getCurrentNodeLevel() {
  return Cookies.get(currentNodeLevelKey)
}

export function setCurrentNodeLevel(level) {
  Cookies.set(currentNodeLevelKey, level)
}

export function removeCurrentNodeLevel() {
  Cookies.remove(currentNodeLevelKey)
}

export function getCurrentNodeId() {
  return Cookies.get(currentNodeIdKey)
}

export function setCurrentNodeId(id) {
  if (id != null && id != undefined && id != '') {
    Cookies.set(currentNodeIdKey, id)
  }
}

export function removeCurrentNodeId() {
  Cookies.remove(currentNodeIdKey)
}

export function getOrigin() {
  return Cookies.get(originKey)
}

export function setOrigin(origin) {
  Cookies.set(originKey, origin)
}

export function removeOrigin() {
  Cookies.remove(originKey)
}

export function getDiagnoseDeviceCode() {
  return Cookies.get(diagnoseDeviceCodeKey)
}

export function setDiagnoseDeviceCode(deviceCode) {
  Cookies.set(diagnoseDeviceCodeKey, deviceCode)
}

export function removeDiagnoseDeviceCode() {
  Cookies.remove(diagnoseDeviceCodeKey)
}

export function getMenu() {
  return Cookies.get(menuKey)
}

export function setMenu(menu) {
  Cookies.set(menuKey, menu)
}

export function removeMenu() {
  Cookies.remove(menuKey)
}

export function getDdsUserInfo() {
  let ddsUserInfo = sessionStorage.getItem(DdsUserInfoKey)
  return JSON.parse(ddsUserInfo)
}

export function getUserInfo() {
  let userInfo = sessionStorage.getItem(DosUserInfoKey)
  return JSON.parse(userInfo)
}

export function setUserInfo(userInfo) {
  sessionStorage.setItem(DosUserInfoKey, JSON.stringify(userInfo))
}

export function getLoginName() {
  return Cookies.get(LoginNameKey)
}

export function setLoginName(loginName) {
  return Cookies.set(LoginNameKey, loginName)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserId(userId) {
  return Cookies.set(UserIdKey, userId)
}

export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUsername(username) {
  return Cookies.set(UsernameKey, username)
}

export function getUsername() {
  return Cookies.get(UsernameKey)
}

export function removeUsername() {
  return Cookies.remove(UsernameKey)
}

export function removeUserId() {
  return Cookies.remove(UserIdKey)
}

export function setRoles(roles) {
  return Cookies.set(RolesKey, roles)
}

export function getRoles() {
  return Cookies.get(RolesKey)
}

export function removeRoles() {
  return Cookies.remove(RolesKey)
}

export function getCurrentEnv() {
  if (window.location.href.indexOf('eplattest') != -1) {
    return 'eplattest'
  } else if (window.location.href.indexOf('localhost') != -1) {
    return 'local'
  } else {
    return 'sso'
  }
}
