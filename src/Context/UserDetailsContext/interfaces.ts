enum Role {
  ADMIN = "ROLE_ADMIN",
  USER = "ROLE_USER",
}

export interface IAuthority {
  authority: Role
}

export interface IUserDetails {
  id: number,
  email: string,
  username: string,
  enabled: boolean,
  authorities: IAuthority[],
  accountNonExpired: boolean,
  accountNonLocked: boolean,
  credentialsNonExpired: boolean,
}

export interface IUserDetailsContext {
  userDetails?: IUserDetails,
  isAuthenticated: boolean | null,
  handleIsAuthenticated: () => Promise<void>,
  clearAuthentication: () => void,
}