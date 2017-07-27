#!/usr/bin/env python

import requests, json, sys, pprint
pp = pprint.PrettyPrinter(indent=4)

class cc:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def get(endpoint):
    url = config["backend"] + endpoint
    r = requests.get(url)
    if r.status_code != 200:
        print(cc.FAIL + ("ERROR: For GET %s received %d response code " % (endpoint, r.status_code)) + str(r.text) + cc.ENDC)
        sys.exit(1)
    return json.loads(r.text)

def put(endpoint):
    url = config["backend"] + endpoint
    r = requests.put(url)
    if r.status_code != 200:
        print(cc.FAIL + ("ERROR: For PUT %s received %d response code " % (endpoint, r.status_code)) + str(r.text) + cc.ENDC)
        sys.exit(1)
    return json.loads(r.text)

def getPosts(postId=None):
    endpoint = '/posts'
    if postId is not None:
        endpoint = (endpoint + "/%d") % postId
    return checkPosts(get(endpoint))

def checkPosts(result):
    if "posts" not in result:
        print(cc.FAIL + "ERROR: GET /posts did not have \"posts\" entry" + cc.ENDC)
        print(result)
        return []
    else:
        return result["posts"]

def addPost(body):
    r = requests.post(config["backend"] + "/post", json={'body':body})
    return checkPosts( json.loads(r.text) )

def msg(message):
    print(cc.BLUE + message + cc.ENDC)

################################################

if len(sys.argv) < 2:
    print("usage: %s README.json" % sys.argv[0])
    sys.exit(1)

with open(sys.argv[1], 'r') as f:
    config = json.loads(f.read())
    for key in config.keys():
        if config[key].endswith('/'):
            config[key] = (config[key])[:-1]

print(cc.YELLOW + ("Checking for %s site %s" % (config['netid'], config['backend'])) + cc.ENDC)

######################################
# inital GET
r = get("/")
msg("GET /")
pp.pprint(r)

# GET /posts
posts = getPosts()
msg("GET /posts")
pp.pprint(posts)

if len(posts) < 3:
    print(cc.FAIL + ("FAIL: Expected at least 3 posts from GET /posts but found %d " % len(posts)) + cc.ENDC)
else:
    print(cc.GREEN + ("OK: GET /posts returned %d posts, expecting at least 3" % len(posts)) + cc.ENDC)

######################################
# add a new post
body = "Hello World!"
newPosts = addPost(body)
msg("POST /post -d " + body)
pp.pprint(newPosts)

if len(newPosts) is not 1:
    print(cc.FAIL + ("FAIL: Expected 1 new post added but found %d posts" % len(newPosts)) + cc.ENDC)
else:
    newPostId = newPosts[0]['id']
    print(cc.GREEN + ("OK: POST /post returned one new post with id=%d" % newPostId) + cc.ENDC)
    if newPosts[0]['body'] != body:
        print(cc.FAIL + ("FAIL: Post did not have the correct body message: %s vs %s" % (newPosts[0]['body'], body)) + cc.ENDC)
    else:
        print(cc.GREEN + ("OK: post body was correct") + cc.ENDC)
    ######################################
    # get that new post by itself
    getNewPost = getPosts(newPostId)
    msg("GET /posts/%d" % newPostId)
    pp.pprint(getNewPost)
    if len(getNewPost) is not 1:
        print(cc.FAIL + ("FAIL: Expected to get the one post that was added but found %d posts" % len(getNewPost)) + cc.ENDC)
    else:
        print(cc.GREEN + ("OK: GET /posts/%d got the new post" % newPostId) + cc.ENDC)
        if getNewPost[0]['body'] != newPosts[0]['body'] or newPosts[0]['body'] != body:
            print(cc.FAIL + ("FAIL: Post did not have the correct body message: %s" % getNewPost[0]['body']) + cc.ENDC)
        else:
            print(cc.GREEN + ("OK: post body was correct") + cc.ENDC)

######################################
# confirm that we only added one post
posts2 = getPosts()
msg("GET /posts")
pp.pprint(posts2)
if len(posts2) is not len(posts) + 1:
    print(cc.FAIL + ("FAIL: Expected one new post added but found %d + 1 = %d" % (len(posts), len(posts2))) + cc.ENDC)
else:
    print(cc.GREEN + ("OK: GET /posts returned one additional post") + cc.ENDC)

######################################
print(cc.YELLOW + ('Testing stubs...') + cc.ENDC)
# Stubs
for e in [ "/status", "/statuses", "/statuses/"+config['netid'], "/email", "/email/"+config['netid'], "/zipcode", "/zipcode/"+config['netid'], "/pictures", "/pictures/" + config['netid'] ]:
    msg("GET " + e)
    pp.pprint(get(e))
for e in [ "/status", "/email", "/zipcode", "/picture" ]:
    msg("PUT " + e)
    pp.pprint(put(e))

## done
print(cc.YELLOW + ('COMPLETE!') + cc.ENDC)
