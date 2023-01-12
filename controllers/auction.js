exports.create = (req, res, next) => {
    const images = req.files 
    const title = req.body?.title
    const description = req.body?.description
    const hourCount = req.body?.hourCount
    const minimumBid = req.body?.minimumBid
    const tags = req.body.tags
    
    console.log(images)
    console.log(title)
    console.log(description)
    console.log(hourCount)
    console.log(minimumBid)
    console.log(tags)

    res.status(200).send()
}