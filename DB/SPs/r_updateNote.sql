DELIMITER $$
DROP PROCEDURE IF EXISTS `r_updateNote`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `r_updateNote`(
    in _id int,
    in _title varchar(255), 
    in _content longtext,
    in _category_id int
    )
BEGIN
    
    update note set
        title = coalesce(_title, title),
        content = coalesce(_content, content),
        category_id = coalesce(_category_id, category_id),
        when_updated = now()
    where id = _id;
   
    select
        n.*,
        nc.name as category_name
    from note n
    inner join note_category nc
    on n.category_id = nc.id
    where n.id = _id;
   
END$$
DELIMITER ;
