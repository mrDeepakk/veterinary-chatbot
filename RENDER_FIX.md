# Render Deployment Quick Fix

## Error: "open Dockerfile: no such file or directory"

This means Render is looking for the Dockerfile in the wrong location.

### Fix for Blueprint Deployment

The `render.yaml` has been updated. Re-deploy:

```bash
git add render.yaml
git commit -m "Fix Dockerfile path in render.yaml"
git push origin main
```

Then in Render Dashboard:
- Go to your Blueprint
- Click "Redeploy"

---

### Fix for Manual Deployment

If you created the service manually (not using Blueprint):

1. **Go to your service in Render Dashboard**
2. **Click "Settings"**
3. **Scroll to "Docker Configuration"**
4. **Set these values**:
   - **Dockerfile Path**: `server/Dockerfile`
   - **Docker Context Directory**: `.` (or leave empty for root)
   - **Docker Build-Time Arguments**: (leave empty)

5. **Click "Save Changes"**
6. **Trigger Manual Deploy**:
   - Go to "Manual Deploy" → "Deploy latest commit"

---

### Verify Configuration

After fixing, Render should show:
```
Building from Dockerfile: server/Dockerfile
Context: . (root)
```

The build will then succeed and deploy your application.

---

### If Using render.yaml (Recommended)

Make sure your `render.yaml` has:

```yaml
services:
  - type: web
    name: veterinary-chatbot
    env: docker
    dockerfilePath: server/Dockerfile  # No leading ./
    dockerContext: .
```

**Note**: No `./` prefix on the dockerfilePath when using render.yaml
