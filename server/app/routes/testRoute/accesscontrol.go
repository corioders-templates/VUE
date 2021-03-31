package testRoute

import (
	"context"
	"net/http"

	"github.com/corioders/gokit/web"
	"github.com/corioders/gokit/web/middleware/accesscontrol"
	"github.com/corioders/gokit/web/middleware/accesscontrol/role"
)

var roleManager = role.MustNewManager("testRouteRm")

var (
	permissionNormal = roleManager.MustNewPermission("permission normal")
)

var (
	roleNormal    = roleManager.MustNewRole("role normal", permissionNormal)
	roleNotNormal = roleManager.MustNewRole("role not normal")
)

func NewAccesscontrol() (login web.Handler, verify web.Middleware, err error) {
	ac, err := accesscontrol.New("testRouteAc", make(accesscontrol.Key, 64))
	if err != nil {
		return nil, nil, err
	}

	login = ac.NewLogin(func(ctx context.Context, r *http.Request) (claims interface{}, roleGranted *role.Role, shouldLogin bool, err error) {
		return nil, roleNormal, true, nil
	})

	verify = ac.NewVerify([]*role.Permission{permissionNormal})

	return login, verify, nil
}
