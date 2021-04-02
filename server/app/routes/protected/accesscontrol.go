package protected

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
	roleNormal = roleManager.MustNewRole("role normal", permissionNormal)
)

func NewAccesscontrol() (login web.Handler, verify web.Middleware, err error) {
	ac, err := accesscontrol.New("testRouteAc", make(accesscontrol.Key, 64))
	if err != nil {
		return nil, nil, err
	}

	lah := func(ctx context.Context, r *http.Request) (claims interface{}, roleGranted *role.Role, shouldLogin bool, err error) {
		return nil, roleNormal, true, nil
	}
	login, err = ac.NewLogin(lah)
	if err != nil {
		return nil, nil, err
	}

	verify, err = ac.NewVerify([]*role.Permission{permissionNormal})
	if err != nil {
		return nil, nil, err
	}

	return login, verify, nil
}
